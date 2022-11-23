<?php

namespace App\Models;

use Akaunting\Money\Currency;
use App\Events\UserActivities\EmailChanged;
use App\Events\UserActivities\PhoneChanged;
use App\Events\UserPresenceChanged;
use App\Helpers\Token;
use App\Helpers\TwoFactorAuth;
use App\Helpers\UserVerification;
use App\Models\Traits\HasRatings;
use App\Models\Traits\Lock;
use App\Models\Traits\Rateable;
use App\Models\Traits\TwoFactor;
use App\Notifications\Auth\VerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Arr;
use Musonza\Chat\Traits\Messageable;
use PHPUnit\Util\Exception;
use Spatie\Permission\Traits\HasRoles;

/**
 * @mixin IdeHelperUser
 */
class User extends Authenticatable implements MustVerifyEmail, Rateable
{
    use HasFactory, Notifiable, TwoFactor, SoftDeletes, HasRoles, Lock, HasRatings, Messageable;

    protected $allRolesAttribute;
    protected $allPermissionsAttribute;
    protected $rankAttribute;
    protected $locationAttribute;
    protected $notificationSettingsAttribute;
    protected $verificationHelperAttribute;
    protected $countryOperationAttribute;
    protected $currencyAttribute;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'deactivated_until',
        'password',
        'country',
        'currency',
        'two_factor_enable',
        'phone_verified_at',
        'email_verified_at',
        'presence',
        'notifications_read_at',
        'last_seen_at',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'roles',
        'permissions',
        'activities',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'phone_verified_at'     => 'datetime',
        'email_verified_at'     => 'datetime',
        'two_factor_enable'     => 'boolean',
        'deactivated_until'     => 'datetime',
        'notifications_read_at' => 'datetime',
        'last_seen_at'          => 'datetime',
        'last_login_at'         => 'datetime',
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['profile'];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'location',
        'country_name',
        'currency_name',
        'currency',
        'rank',
        'country_operation',
        'is_super_admin',
        'all_permissions',
        'all_roles',
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::creating(function ($user) {
            $user->two_factor_secret = app(TwoFactorAuth::class)->generateSecretKey();
        });

        static::updating(function (self $user) {
            if ($user->isDirty('email')) {
                event(new EmailChanged($user));
                $user->email_verified_at = null;
            }

            if ($user->isDirty('presence') && $user->presence === "online") {
                $user->last_seen_at = $user->freshTimestamp();
            }

            if ($user->isDirty('phone')) {
                event(new PhoneChanged($user));
                $user->phone_verified_at = null;
            }
        });

        static::created(function (self $user) {
            $user->profile()->save(new UserProfile);
        });
    }

    /**
     * Get path for profile
     *
     * @return string
     */
    public function path(): string
    {
        return "profile/{$this->id}";
    }

    /**
     * Generate phone token
     *
     * @return array
     */
    public function generatePhoneToken(): array
    {
        return app(Token::class)->generate($this->phone);
    }

    /**
     * Validate phone token
     *
     * @param $token
     * @return bool
     */
    public function validatePhoneToken($token): bool
    {
        return app(Token::class)->validate($this->phone, $token);
    }

    /**
     * Generate email token
     *
     * @return array
     */
    public function generateEmailToken(): array
    {
        return app(Token::class)->generate($this->email);
    }

    /**
     * Validate email token
     *
     * @param $token
     * @return bool
     */
    public function validateEmailToken($token): bool
    {
        return app(Token::class)->validate($this->email, $token);
    }

    /**
     * Check if user is super_admin
     *
     * @return bool
     */
    public function getIsSuperAdminAttribute(): bool
    {
        return $this->hasRole(Role::superAdmin());
    }

    /**
     * Get location activity
     *
     * @return mixed|null
     */
    public function getLocationAttribute(): mixed
    {
        if (!isset($this->locationAttribute)) {
            $activity = $this->activities()->latest()->first();
            $this->locationAttribute = $activity?->location;
        }

        return $this->locationAttribute;
    }

    /**
     * Country operation status
     *
     * @return bool
     */
    public function getCountryOperationAttribute(): bool
    {
        if (!isset($this->countryOperationAttribute)) {
            $this->countryOperationAttribute = OperatingCountry::where('code', $this->country)->exists();
        }

        return $this->countryOperationAttribute;
    }

    /**
     * Get currency
     *
     * @param $value
     * @return string
     */
    public function getCurrencyAttribute($value): string
    {
        if (!isset($this->currencyAttribute)) {
            $this->currencyAttribute = SupportedCurrency::find($value) ? strtoupper($value) : defaultCurrency();
        }

        return $this->currencyAttribute;
    }

    /**
     * Get currency name
     *
     * @return Attribute
     */
    protected function currencyName(): Attribute
    {
        return Attribute::make(
            get: fn() => (new Currency($this->currency))->getName()
        )->shouldCache();
    }

    /**
     * Check if user's phone is verified
     *
     * @return bool
     */
    public function isPhoneVerified(): bool
    {
        return (bool) $this->phone_verified_at;
    }

    /**
     * Check if user's email is verified
     *
     * @return bool
     */
    public function isEmailVerified(): bool
    {
        return (bool) $this->email_verified_at;
    }

    /**
     * Get rank by role
     *
     * @return int|null
     */
    public function rank(): ?int
    {
        if (!isset($this->rankAttribute)) {
            $role = $this->roles()->orderBy('rank')->first();
            $this->rankAttribute = $role?->rank;
        }

        return $this->rankAttribute;
    }

    /**
     * Check if user is superior to another
     *
     * @param User $user
     * @return bool
     */
    public function superiorTo(self $user): bool
    {
        return !is_null($this->rank()) && (is_null($user->rank()) || $this->rank() < $user->rank());
    }

    /**
     * Query subordinates
     *
     * @return Builder
     */
    public function subordinates(): Builder
    {
        if (is_null($this->rank())) {
            throw new Exception('User does not have a rank.');
        }

        return self::whereKeyNot($this->getKey())
            ->whereDoesntHave('roles', function (Builder $query) {
                $query->where('rank', '<=', $this->rank());
            });
    }

    /**
     * User's Rank
     *
     * @return int|null
     */
    public function getRankAttribute(): ?int
    {
        return $this->rank();
    }

    /**
     * long_term attribute
     *
     * @return bool
     */
    public function getLongTermAttribute(): bool
    {
        return $this->isLongTerm();
    }

    /**
     * active attribute
     *
     * @return bool
     */
    public function getActiveAttribute(): bool
    {
        return $this->isActive();
    }

    /**
     * Log user activity
     *
     * @param $action
     * @param string $ip
     * @param null $source
     * @param null $agent
     * @return Model
     */
    public function log($action, string $ip = '127.0.0.1', $source = null, $agent = null): Model
    {
        return $this->activities()->create([
            'action'   => $action,
            'source'   => $source,
            'ip'       => $ip,
            'location' => geoip($ip)->toArray(),
            'agent'    => $agent,
        ]);
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmail);
    }

    /**
     * Get private channel
     *
     * @return string
     */
    public function privateChannel()
    {
        return 'App.Models.User.' . $this->id;
    }

    /**
     * The channels the user receives notification broadcasts on.
     *
     * @return string
     */
    public function receivesBroadcastNotificationsOn()
    {
        return $this->privateChannel();
    }

    /**
     * Route notifications for the Vonage channel.
     *
     * @return string
     */
    public function routeNotificationForVonage()
    {
        return preg_replace('/\D+/', '', $this->phone);
    }

    /**
     * Route notifications for the SNS channel.
     *
     * @return string
     */
    public function routeNotificationForSns()
    {
        return $this->phone;
    }

    /**
     * Route notifications for the Twilio channel.
     *
     * @return string
     */
    public function routeNotificationForTwilio()
    {
        return $this->phone;
    }

    /**
     * Route notifications for the Africas Talking channel.
     *
     * @return string
     */
    public function routeNotificationForAfricasTalking()
    {
        return $this->phone;
    }

    /**
     * User profile
     *
     * @return HasOne
     */
    public function profile()
    {
        return $this->hasOne(UserProfile::class, 'user_id', 'id');
    }

    /**
     * Get wallet address label
     *
     * @return null|string
     */
    public function getWalletAddressLabel(): ?string
    {
        return $this->email;
    }

    /**
     * Get user roles
     *
     * @return array
     */
    public function getAllRolesAttribute(): array
    {
        if (!isset($this->allRolesAttribute)) {
            $this->allRolesAttribute = $this->roles()->orderBy('rank')->get()->pluck('name')->toArray();
        }

        return $this->allRolesAttribute;
    }

    /**
     * Get user permissions
     *
     * @return array
     * @throws \Exception
     */
    public function getAllPermissionsAttribute(): array
    {
        if (!isset($this->allPermissionsAttribute)) {
            $this->allPermissionsAttribute = $this->getAllPermissions()->pluck('name')->toArray();
        }

        return $this->allPermissionsAttribute;
    }

    /**
     * Get participation details
     *
     * @return array
     */
    public function getParticipantDetails(): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'presence'     => $this->presence,
            'last_seen_at' => $this->last_seen_at,
            'picture'      => $this->profile->picture,
        ];
    }

    /**
     * Get country name
     *
     * @return Attribute
     */
    protected function countryName(): Attribute
    {
        return Attribute::make(
            get: fn() => config("countries.$this->country")
        )->shouldCache();
    }

    /**
     * Update authenticated user's presence
     *
     * @param $presence
     * @return void
     */
    public function updatePresence($presence)
    {
        $this->update(['presence' => $presence]);
        broadcast(new UserPresenceChanged($this));
    }

    /**
     * Check if user is deactivated
     *
     * @return bool
     */
    public function deactivated(): bool
    {
        return $this->deactivated_until && $this->deactivated_until > now();
    }

    /**
     * Check if user is active
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return !$this->deactivated();
    }

    /**
     * User's wallet accounts
     *
     * @return HasMany
     */
    public function walletAccounts()
    {
        return $this->hasMany(WalletAccount::class, 'user_id', 'id');
    }

    /**
     * User's activities
     *
     * @return HasMany
     */
    public function activities()
    {
        return $this->hasMany(UserActivity::class, 'user_id', 'id');
    }

    /**
     * User's transfer records
     *
     * @return HasManyThrough
     */
    public function transferRecords()
    {
        return $this->hasManyThrough(TransferRecord::class, WalletAccount::class, 'user_id', 'wallet_account_id');
    }

    /**
     * User's exchange trades
     *
     * @return HasManyThrough
     */
    public function exchangeTrades()
    {
        return $this->hasManyThrough(ExchangeTrade::class, WalletAccount::class, 'user_id', 'wallet_account_id');
    }

    /**
     * User's sell trades
     *
     * @return HasManyThrough
     */
    public function sellPeerTrades()
    {
        return $this->hasManyThrough(PeerTrade::class, WalletAccount::class, 'user_id', 'seller_wallet_account_id');
    }

    /**
     * User's buy trades
     *
     * @return HasManyThrough
     */
    public function buyPeerTrades()
    {
        return $this->hasManyThrough(PeerTrade::class, WalletAccount::class, 'user_id', 'buyer_wallet_account_id');
    }

    /**
     * Get notification settings
     *
     * @return HasMany
     */
    public function notificationSetting()
    {
        return $this->hasMany(UserNotificationSetting::class, 'user_id', 'id');
    }

    /**
     * Get notification settings
     *
     * @return array
     */
    public function getNotificationSettings(): array
    {
        $settings = config('notifications.settings');

        if (!isset($this->notificationSettingsAttribute)) {
            $this->updateNotificationSettings();

            $attribute = $this->notificationSetting()->get()
                ->map(function ($saved) use ($settings) {
                    $name = $saved['name'];

                    if (!isset($settings[$name])) {
                        return null;
                    }

                    foreach ($settings[$name] as $channel => $status) {
                        if (is_null($status)) {
                            unset($saved[$channel]);
                        }
                    }

                    $saved['title'] = trans("notifications.$name.title");

                    return $saved;
                })
                ->filter()->values()->toArray();

            $this->notificationSettingsAttribute = $attribute;
        }

        return $this->notificationSettingsAttribute;
    }

    /**
     * Update user settings
     *
     * @return void
     */
    protected function updateNotificationSettings()
    {
        $settings = config('notifications.settings', []);

        $saved = $this->notificationSetting()->get()->toArray();
        $savedNames = Arr::pluck($saved, 'name');

        $updated = array_diff(array_keys($settings), $savedNames);

        collect($updated)->each(function ($name) use ($settings) {
            $this->notificationSetting()->updateOrCreate(compact('name'), [
                'email'    => (bool) $settings[$name]['email'],
                'database' => (bool) $settings[$name]['database'],
                'sms'      => (bool) $settings[$name]['sms'],
            ]);
        });
    }

    /**
     * Get user's documents
     *
     * @return HasMany
     */
    public function documents()
    {
        return $this->hasMany(UserDocument::class, 'user_id', 'id');
    }

    /**
     * User's address
     *
     * @return HasOne
     */
    public function address()
    {
        return $this->hasOne(UserAddress::class, 'user_id', 'id');
    }

    /**
     * User's payment accounts
     *
     * @return HasMany
     */
    public function paymentAccounts()
    {
        return $this->hasMany(PaymentAccount::class, 'user_id', 'id')
            ->has('supportedCurrency');
    }

    /**
     * Get followers
     *
     * @return BelongsToMany
     */
    public function followers()
    {
        return $this->belongsToMany(User::class, 'followers', 'followed_id', 'follower_id')
            ->withPivot('blocked')->withTimestamps();
    }

    /**
     * Get follower
     *
     * @param User $user
     * @return mixed
     */
    public function getFollowerPivot(self $user)
    {
        return $this->followers()->find($user->id)?->pivot;
    }

    /**
     * Get following
     *
     * @return BelongsToMany
     */
    public function following()
    {
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'followed_id')
            ->withPivot('blocked')->withTimestamps();
    }

    /**
     * Check if user is following another
     *
     * @param User $user
     * @return bool
     */
    public function isFollowing(User $user): bool
    {
        return $this->following()->whereKey($user->id)->exists();
    }

    /**
     * Get following
     *
     * @param User $user
     * @return mixed
     */
    public function getFollowingPivot(self $user)
    {
        return $this->following()->find($user->id)?->pivot;
    }

    /**
     * Check if user can be followed
     *
     * @param User $user
     * @return bool
     */
    public function canFollow(self $user): bool
    {
        return $this->isNot($user);
    }

    /**
     * Check if user cannot be followed
     *
     * @param User $user
     * @return bool
     */
    public function cannotFollow(self $user): bool
    {
        return !$this->canFollow($user);
    }

    /**
     * Current payment account.
     *
     * @return PaymentAccount
     */
    public function getPaymentAccount(): PaymentAccount
    {
        return $this->getPaymentAccountByCurrency($this->currency);
    }

    /**
     * Get payment account by currency
     *
     * @param string $currency
     * @return PaymentAccount
     */
    public function getPaymentAccountByCurrency(string $currency): PaymentAccount
    {
        return $this->paymentAccounts()->where('currency', $currency)
            ->firstOr(function () use ($currency) {
                return $this->paymentAccounts()->create(['currency' => $currency]);
            });
    }

    /**
     * User's bank accounts
     *
     * @return HasMany
     */
    public function activeBankAccounts()
    {
        return $this->bankAccounts()
            ->where('currency', $this->currency)
            ->where(function ($query) {
                $query->whereHas('bank.operatingCountries', function (Builder $query) {
                    $query->where('code', $this->country);
                })->orDoesntHave('bank');
            });
    }

    /**
     * User's BankAccounts
     *
     * @return HasMany
     */
    public function bankAccounts()
    {
        return $this->hasMany(BankAccount::class, 'user_id', 'id')->has('supportedCurrency');
    }

    /**
     * Get operating banks
     *
     * @return Builder
     */
    public function getOperatingBanks(): Builder
    {
        return Bank::country($this->country);
    }

    /**
     * Get deposit bank account
     *
     * @return BankAccount
     */
    public function getDepositBankAccount(): ?BankAccount
    {
        return BankAccount::doesntHave('user')
            ->has('supportedCurrency')
            ->whereHas('bank.operatingCountries', function (Builder $query) {
                $query->where('code', $this->country);
            })
            ->where('currency', $this->currency)
            ->latest()->first();
    }

    /**
     * Get verification helper
     *
     * @return UserVerification
     */
    public function verification(): UserVerification
    {
        if (!isset($this->verificationHelperAttribute)) {
            $this->verificationHelperAttribute = UserVerification::make($this);
        }

        return $this->verificationHelperAttribute;
    }

    /**
     * Super admin users
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeSuperAdmin($query)
    {
        return $query->role(Role::superAdmin())->latest();
    }

    /**
     * Operator users
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeOperator($query)
    {
        return $query->role(Role::operator())->latest();
    }

    /**
     * permission: view user
     *
     * @param User $user
     * @return bool
     */
    public function canViewUser(self $user): bool
    {
        return $this->is($user) || $this->can('access_control_panel');
    }

    /**
     * permission: update user
     *
     * @param User $user
     * @return bool
     */
    public function canUpdateUser(self $user): bool
    {
        return $this->isNot($user) && $this->superiorTo($user) && $this->can('manage_users');
    }

    /**
     * permission: delete user
     *
     * @param User $user
     * @return bool
     */
    public function canDeleteUser(self $user): bool
    {
        return $this->isNot($user) && $this->superiorTo($user) && $this->can('delete_users');
    }

    /**
     * Get user's WalletAccount
     *
     * @param Wallet $wallet
     * @return WalletAccount
     */
    public function getWalletAccount(Wallet $wallet)
    {
        return $wallet->getAccount($this);
    }

    /**
     * Rate model
     *
     * @param Rateable $rateable
     * @param int $value
     * @param string|null $comment
     * @return Rating
     */
    public function rate(Rateable $rateable, int $value, string $comment = null)
    {
        $rating = new Rating();

        $rating->value = min($value, 5);
        $rating->comment = $comment;
        $rating->user()->associate($this);

        $rateable->ratings()->save($rating);

        return $rating;
    }

    /**
     * Rate model once
     *
     * @param Rateable $rateable
     * @param int $value
     * @param string|null $comment
     * @return Rating
     */
    public function rateOnce(Rateable $rateable, int $value, string $comment = null)
    {
        $query = $rateable->ratings()->where('user_id', $this->id);

        if ($rating = $query->first()) {
            $rating->value = min($value, 5);
            $rating->comment = $comment;
            return tap($rating)->save();
        } else {
            return $this->rate($rateable, $value, $comment);
        }
    }

    /**
     * Check if user is offline
     *
     * @return bool
     */
    public function isUnavailable(): bool
    {
        return !$this->last_seen_at || now()->diffInMinutes($this->last_seen_at) > 30;
    }

    /**
     * Check if this is a "long term" user
     *
     * @return bool
     */
    public function isLongTerm()
    {
        return now()->diffInMonths($this->created_at) >= settings()->get('long_term_period');
    }

    /**
     * Retrieve the User for a bound value.
     *
     * @param mixed $value
     * @param string|null $field
     * @return Model
     */
    public function resolveRouteBinding($value, $field = null)
    {
        try {
            return $this->resolveRouteBindingQuery($this, $value, $field)->firstOrFail();
        } catch (ModelNotFoundException) {
            abort(404, trans('user.not_found'));
        }
    }

    /**
     * Get exchange operator
     *
     * @return User|null
     */
    public static function exchangeOperator(): ?User
    {
        return Module::exchange()->operator;
    }

    /**
     * Get giftcard operator
     *
     * @return User|null
     */
    public static function giftcardOperator(): ?User
    {
        return Module::giftcard()->operator;
    }

    /**
     * Get wallet operator
     *
     * @return User|null
     */
    public static function walletOperator(): ?User
    {
        return Module::wallet()->operator;
    }

    /**
     * Get peer trade operator
     *
     * @return User|null
     */
    public static function peerOperator(): ?User
    {
        return Module::peer()->operator;
    }
}
