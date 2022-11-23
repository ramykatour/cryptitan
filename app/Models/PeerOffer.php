<?php

namespace App\Models;

use Akaunting\Money\Money;
use App\Helpers\CoinFormatter;
use App\Models\Traits\Cache;
use App\Models\Traits\Lock;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @mixin IdeHelperPeerOffer
 */
class PeerOffer extends Model
{
    use HasFactory, Lock, Uuid, Cache;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'time_limit',
        'instruction',
        'auto_reply',
        'require_long_term',
        'require_verification',
        'require_following',
        'closed_at',
        'status',
        'display',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'display'              => 'boolean',
        'status'               => 'boolean',
        'closed_at'            => 'datetime',
        'percent_price'        => 'float',
        'fixed_price'          => 'float',
        'require_long_term'    => 'boolean',
        'require_verification' => 'boolean',
        'require_following'    => 'boolean',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'formatted_min_amount',
        'formatted_max_amount',
        'coin',
        'owner'
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['walletAccount', 'paymentMethod', 'bankAccount'];

    /**
     * Cast value as coin object
     *
     * @param $amount
     * @param bool $convert
     * @return CoinFormatter
     */
    protected function castCoin($amount, bool $convert = false): CoinFormatter
    {
        return coin($amount, $this->walletAccount->wallet->coin, $convert);
    }

    /**
     * Parse value as coin object
     *
     * @param $amount
     * @return CoinFormatter
     */
    public function parseCoin($amount): CoinFormatter
    {
        return $this->castCoin($amount, true);
    }

    /**
     * Cast value as Money object
     *
     * @param $amount
     * @param bool $convert
     * @return Money
     */
    protected function castMoney($amount, bool $convert = false)
    {
        return $this->walletAccount->wallet->castMoney($amount, $this->currency, $convert);
    }

    /**
     * Parse amount as money
     *
     * @param $amount
     * @return Money
     */
    public function parseMoney($amount): Money
    {
        return $this->walletAccount->wallet->parseMoney($amount, $this->currency);
    }

    /**
     * Get min_amount Object
     *
     * @return Money
     */
    public function getMinAmountObject()
    {
        return $this->remember("min_amount_object", function () {
            return $this->castMoney($this->getAttributeFromArray('min_amount'));
        });
    }

    /**
     * min_amount Attribute
     *
     * @return Attribute
     */
    protected function minAmount(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getMinAmountObject()->getValue(),
            set: fn(Money $value) => $value->getAmount()
        );
    }

    /**
     * formatted_min_amount Attribute
     *
     * @return string
     */
    public function getFormattedMinAmountAttribute()
    {
        return $this->getMinAmountObject()->format();
    }

    /**
     * Get max_amount object
     *
     * @return Money
     */
    public function getMaxAmountObject()
    {
        return $this->remember("max_amount_object", function () {
            return $this->castMoney($this->getAttributeFromArray('max_amount'));
        });
    }

    /**
     * max_amount Attribute
     *
     * @return Attribute
     */
    protected function maxAmount(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getMaxAmountObject()->getValue(),
            set: fn(Money $value) => $value->getAmount(),
        );
    }

    /**
     * formatted_max_amount Attribute
     *
     * @return string
     */
    public function getFormattedMaxAmountAttribute()
    {
        return $this->getMaxAmountObject()->format();
    }

    /**
     * Get price object
     *
     * @return Money
     */
    public function getPriceObject()
    {
        return $this->remember("price_object", function () {
            if ($this->price_type === "percent") {
                $currentPrice = $this->walletAccount->wallet->getUnitObject()->getPrice($this->currency);
                return $this->parseMoney($currentPrice)->multiply($this->percent_price / 100);
            } else {
                return $this->parseMoney($this->fixed_price);
            }
        });
    }

    /**
     * Get price attribute
     *
     * @return float
     */
    public function getPriceAttribute()
    {
        return $this->getPriceObject()->getValue();
    }

    /**
     * Get formatted_price attribute
     *
     * @return string
     */
    public function getFormattedPriceAttribute()
    {
        return $this->getPriceObject()->format();
    }

    /**
     * Get price
     *
     * @param CoinFormatter $amount
     * @return Money
     */
    public function getPrice(CoinFormatter $amount): Money
    {
        return $this->parseMoney($amount->calcPrice($this->price));
    }

    /**
     * Get the min_value object
     *
     * @return CoinFormatter
     */
    public function getMinValueObject()
    {
        return $this->castCoin($this->getMinAmountObject()->getValue() / $this->getPriceObject()->getValue(), true);
    }

    /**
     * Get min_value attribute
     *
     * @return float
     */
    public function getMinValueAttribute()
    {
        return $this->getMinValueObject()->getValue();
    }

    /**
     * Get the max_value object
     *
     * @return CoinFormatter
     */
    public function getMaxValueObject()
    {
        return $this->castCoin($this->getMaxAmountObject()->getValue() / $this->getPriceObject()->getValue(), true);
    }

    /**
     * Get max_value attribute
     *
     * @return float
     */
    public function getMaxValueAttribute()
    {
        return $this->getMaxValueObject()->getValue();
    }

    /**
     * Get "buy" or "sell" fee
     *
     * @param CoinFormatter $amount
     * @return CoinFormatter
     */
    public function getFee(CoinFormatter $amount): CoinFormatter
    {
        return $this->walletAccount->wallet->getPeerFee($amount, $this->type);
    }

    /**
     * Check if offer can be enabled by user
     *
     * @param User $user
     * @return bool
     */
    public function canEnableBy(User $user): bool
    {
        return $this->isDisabled() && $this->isManagedBy($user);
    }

    /**
     * Check if offer can be disabled by user
     *
     * @param User $user
     * @return bool
     */
    public function canDisableBy(User $user): bool
    {
        return $this->isEnabled() && $this->isManagedBy($user);
    }

    /**
     * Check if offer can be closed by user
     *
     * @param User $user
     * @return bool
     */
    public function canCloseBy(User $user): bool
    {
        return $this->isOpened() && $this->isManagedBy($user);
    }

    /**
     * Check manage ability
     *
     * @param User $user
     * @return bool
     */
    public function isManagedBy(User $user): bool
    {
        return $user->is($this->walletAccount->user) || $user->can("manage_peer_trades");
    }

    /**
     * Check if offer can be traded with user
     *
     * @param User $user
     * @return bool
     */
    public function canTradeWith(User $user): bool
    {
        $status = $this->isAvailable() &&
            $this->owner->isActive() && $this->owner->isNot($user);

        if ($this->require_long_term) {
            $status = $status && $user->isLongTerm();
        }

        if ($this->require_verification) {
            $status = $status && $user->verification()->complete();
        }

        if ($this->require_following) {
            $status = $status && $user->isFollowing($this->owner);
        }

        return $status;
    }

    /**
     * Check for "sell" offer
     *
     * @return bool
     */
    public function isSell(): bool
    {
        return $this->type === "sell";
    }

    /**
     * Check for "buy" offer
     *
     * @return bool
     */
    public function isBuy(): bool
    {
        return $this->type === "buy";
    }

    /**
     * Check if offer is opened
     *
     * @return bool
     */
    public function isOpened(): bool
    {
        return !$this->isClosed();
    }

    /**
     * Check if offer is closed
     *
     * @return bool
     */
    public function isClosed(): bool
    {
        return (bool) $this->closed_at;
    }

    /**
     * Displayed check
     *
     * @return bool
     */
    public function isDisplayed(): bool
    {
        return (bool) $this->display;
    }

    /**
     * NotDisplayed check
     *
     * @return bool
     */
    public function isNotDisplayed(): bool
    {
        return !$this->isDisplayed();
    }

    /**
     * Status check
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        return (bool) $this->status;
    }

    /**
     * Status check
     *
     * @return bool
     */
    public function isDisabled(): bool
    {
        return !$this->isEnabled();
    }

    /**
     * Check if offer is available
     *
     * @return bool
     */
    public function isAvailable(): bool
    {
        return $this->isOpened() && $this->isEnabled() && $this->isDisplayed();
    }

    /**
     * Check if offer requires bank account.
     *
     * @return bool
     */
    public function requiresBankAccount()
    {
        return $this->payment === "bank_account" && $this->type === "buy";
    }

    /**
     * Get the creator attribute
     *
     * @return User
     */
    public function getOwnerAttribute()
    {
        return $this->walletAccount->user;
    }

    /**
     * Get coin attribute
     *
     * @return Coin
     */
    public function getCoinAttribute()
    {
        return $this->walletAccount->wallet->coin;
    }

    /**
     * Scope closed query
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeClosed($query)
    {
        return $query->whereNotNull('closed_at');
    }

    /**
     * Scope opened query
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeOpened($query)
    {
        return $query->whereNull('closed_at');
    }

    /**
     * Scope displayed query
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeDisplayed($query)
    {
        return $query->where('display', true);
    }

    /**
     * Scope notDisplayed query
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeNotDisplayed($query)
    {
        return $query->where('display', false);
    }

    /**
     * Scope enabled query
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeEnabled($query)
    {
        return $query->where('status', true);
    }

    /**
     * Scope disabled query
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeDisabled($query)
    {
        return $query->where('status', false);
    }

    /**
     * Scope displayedFor user
     *
     * @param Builder|static $query
     * @return Builder
     */
    public function scopeDisplayedFor($query, User $user)
    {
        $query->whereHas('walletAccount.user', function (Builder $query) {
            $query->where(function (Builder $query) {
                $query->whereNull('deactivated_until');
                $query->orWhereDate('deactivated_until', '<', now());
            });
        });

        return $query->opened()->enabled()->displayed();
    }

    /**
     * Scope user ownership
     *
     * @param $query
     * @param User $user
     * @return mixed
     */
    public function scopeOwnedBy($query, User $user)
    {
        return $query->whereHas('walletAccount.user', function (Builder $query) use ($user) {
            $query->where('users.id', $user->id);
        });
    }

    /**
     * Retrieve the PeerOffer for a bound value.
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
            abort(404, trans('peer-offer.not_found'));
        }
    }

    /**
     * Related PeerTrades
     *
     * @return HasMany
     */
    public function trades()
    {
        return $this->hasMany(PeerTrade::class, 'offer_id', 'id');
    }

    /**
     * Related wallet account
     *
     * @return BelongsTo
     */
    public function walletAccount()
    {
        return $this->belongsTo(WalletAccount::class, 'wallet_account_id', 'id');
    }

    /**
     * Related payment method
     *
     * @return BelongsTo
     */
    public function paymentMethod()
    {
        return $this->belongsTo(PeerPaymentMethod::class, 'payment_method_id', 'id');
    }

    /**
     * Related bank account
     * (only for "sell" offers)
     *
     * @return BelongsTo
     */
    public function bankAccount()
    {
        return $this->belongsTo(BankAccount::class, 'bank_account_id', 'id');
    }
}
