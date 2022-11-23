<?php

namespace App\Models;

use Akaunting\Money\Currency;
use Akaunting\Money\Money;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @mixin IdeHelperFeatureLimit
 */
class FeatureLimit extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'name';

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'title',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'unverified_limit' => 'float',
        'basic_limit'      => 'float',
        'advanced_limit'   => 'float',
    ];

    /**
     * Get title attribute
     *
     * @return string
     */
    public function getTitleAttribute()
    {
        return trans("feature.$this->name");
    }

    /**
     * Check if feature is enabled for user
     *
     * @param User $user
     * @return bool
     */
    public function enabled(User $user): bool
    {
        return $this->getLimit($user) > 0;
    }

    /**
     * Get user's limit
     *
     * @param User $user
     * @return float
     */
    public function getLimit(User $user): float
    {
        $status = $user->verification()->level();
        return $this->{"{$status}_limit"} ?: 0;
    }

    /**
     * Get total usage
     *
     * @param User $user
     * @return float
     */
    public function getUsage(User $user): float
    {
        return $this->usages()
            ->where('user_id', $user->id)
            ->whereDate('created_at', '>=', now()->startOf($this->period))
            ->sum('value');
    }

    /**
     * Available
     *
     * @param User $user
     * @return float
     */
    public function getAvailable(User $user): float
    {
        return max($this->getLimit($user) - $this->getUsage($user), 0);
    }

    /**
     * Check availability
     *
     * @param float|Money $value
     * @param User $user
     * @return bool
     */
    public function checkAvailability(float|Money $value, User $user): bool
    {
        return $this->getAvailable($user) >= $this->parseValue($value);
    }

    /**
     * Set feature usage
     *
     * @param float|Money $value
     * @param User $user
     */
    public function setUsage(float|Money $value, User $user)
    {
        $this->usages()->create([
            'value'   => $this->parseValue($value),
            'user_id' => $user->id,
        ]);
    }

    /**
     * Validate limit value
     *
     * @param float|Money $value
     * @return float
     */
    protected function parseValue(float|Money $value): float
    {
        if ($value instanceof Money) {
            return app('exchanger')
                ->convert($value, new Currency('USD'))
                ->getValue();
        } else {
            return $value;
        }
    }

    /**
     * Feature usage logs
     *
     * @return HasMany
     */
    public function usages()
    {
        return $this->hasMany(FeatureUsage::class, 'feature_name', 'name');
    }

    /**
     * Bank deposit
     *
     * @return self
     */
    public static function paymentsDeposit()
    {
        return self::findOrFail('payments_deposit');
    }

    /**
     * Bank Withdrawal
     *
     * @return self
     */
    public static function paymentsWithdrawal()
    {
        return self::findOrFail('payments_withdrawal');
    }

    /**
     * Wallet Exchange
     *
     * @return self
     */
    public static function walletExchange()
    {
        return self::findOrFail('wallet_exchange');
    }

    /**
     * Giftcard Trade
     *
     * @return self
     */
    public static function giftcardTrade()
    {
        return self::findOrFail('giftcard_trade');
    }
}
