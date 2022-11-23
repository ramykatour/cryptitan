<?php

namespace App\Models;

use Akaunting\Money\Money;
use App\Exceptions\TransferException;
use App\Helpers\CoinFormatter;
use App\Models\Traits\Cache;
use App\Models\Traits\Lock;
use App\Models\Traits\Uuid;
use App\Notifications\PeerTradeCanceled;
use App\Notifications\PeerTradeCompleted;
use App\Notifications\PeerTradeConfirmed;
use App\Notifications\PeerTradeDisputed;
use App\Notifications\PeerTradeStarted;
use Exception;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Musonza\Chat\Chat;
use Musonza\Chat\Models\Conversation;

/**
 * @mixin IdeHelperPeerTrade
 */
class PeerTrade extends Model
{
    use HasFactory, BroadcastsEvents, Lock, Uuid, Cache;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'status',
        'instruction',
        'canceled_at',
        'confirmed_at',
        'disputed_at',
        'completed_at',
        'disputed_by',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'canceled_at'  => 'datetime',
        'confirmed_at' => 'datetime',
        'completed_at' => 'datetime',
        'disputed_at'  => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'formatted_amount',
        'buyer',
        'seller',
        'coin'
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'status' => 'active',
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['buyerWalletAccount', 'sellerWalletAccount', 'offer', 'paymentMethod', 'bankAccount', 'conversation', 'sellerRating', 'buyerRating'];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::created(function (self $record) {
            $record->sendAutoReply();
            $record->seller->notify(new PeerTradeStarted($record));
            $record->buyer->notify(new PeerTradeStarted($record));
        });

        static::updating(function (self $record) {
            if ($record->isDirty("status")) {
                $attribute = match ($record->status) {
                    "canceled" => "canceled_at",
                    "completed" => "completed_at",
                    "disputed" => "disputed_at",
                    default => null
                };

                if (is_string($attribute)) {
                    $record->$attribute = Date::now();
                }
            }
        });

        static::updated(function (self $record) {
            if ($record->isDirty("status")) {
                $notification = match ($record->status) {
                    "canceled" => new PeerTradeCanceled($record),
                    "completed" => new PeerTradeCompleted($record),
                    "disputed" => new PeerTradeDisputed($record),
                    default => null
                };

                if ($notification instanceof Notification) {
                    $record->seller->notify($notification);
                    $record->buyer->notify($notification);
                }
            }

            if ($record->isDirty("confirmed_at") && $record->confirmed) {
                $record->seller->notify(new PeerTradeConfirmed($record));
                $record->buyer->notify(new PeerTradeConfirmed($record));
            }
        });
    }

    /**
     * Get short id
     *
     * @return string
     */
    public function getShortIdAttribute()
    {
        return substr($this->id, 0 , 8);
    }

    /**
     * Cast value as coin object
     *
     * @param $amount
     * @param bool $convert
     * @return CoinFormatter
     */
    protected function castCoin($amount, bool $convert = false): CoinFormatter
    {
        return coin($amount, $this->sellerWalletAccount->wallet->coin, $convert);
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
        return $this->sellerWalletAccount->wallet->castMoney($amount, $this->currency, $convert);
    }

    /**
     * Parse amount as money
     *
     * @param $amount
     * @return Money
     */
    public function parseMoney($amount): Money
    {
        return $this->sellerWalletAccount->wallet->parseMoney($amount, $this->currency);
    }

    /**
     * Get amount object
     *
     * @return Money
     */
    public function getAmountObject()
    {
        return $this->remember("amount_object", function () {
            return $this->castMoney($this->getAttributeFromArray('amount'));
        });
    }

    /**
     * amount Attribute
     *
     * @return Attribute
     */
    protected function amount(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getAmountObject()->getValue(),
            set: fn(Money $value) => $value->getAmount()
        );
    }

    /**
     * formatted_amount Attribute
     *
     * @return string
     */
    public function getFormattedAmountAttribute()
    {
        return $this->getAmountObject()->format();
    }

    /**
     * total_value Object
     *
     * @return CoinFormatter
     */
    public function getTotalValueObject(): CoinFormatter
    {
        return $this->remember("total_value_object", function () {
            return $this->castCoin($this->getAttributeFromArray('total_value'));
        });
    }

    /**
     * total_value Attribute
     *
     * @return Attribute
     */
    protected function totalValue(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getTotalValueObject()->getValue(),
            set: fn(CoinFormatter $value) => $value->getAmount()
        );
    }

    /**
     * fee_value object
     *
     * @return CoinFormatter
     */
    protected function getFeeValueObject(): CoinFormatter
    {
        return $this->remember("fee_value_object", function () {
            return $this->castCoin($this->getAttributeFromArray('fee_value'));
        });
    }

    /**
     * fee_value Attribute
     *
     * @return Attribute
     */
    protected function feeValue(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getFeeValueObject()->getValue(),
            set: fn(CoinFormatter $value) => $value->getAmount()
        );
    }

    /**
     * Get "value" object
     *
     * @return CoinFormatter
     */
    public function getValueObject(): CoinFormatter
    {
        return $this->remember("value_object", function () {
            return $this->castCoin($this->getAttributeFromArray('value'));
        });
    }

    /**
     * "value" Attribute
     *
     * @return Attribute
     */
    protected function value(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getValueObject()->getValue(),
            set: fn(CoinFormatter $value) => $value->getAmount()
        );
    }

    /**
     * Get price object
     *
     * @return Money
     */
    public function getPriceObject()
    {
        return $this->remember("price_object", function () {
            return $this->parseMoney($this->getAttributeFromArray('price'));
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
     * Get buyer attribute
     *
     * @return User
     */
    public function getBuyerAttribute()
    {
        return $this->buyerWalletAccount->user;
    }

    /**
     * Get seller attribute
     *
     * @return User
     */
    public function getSellerAttribute()
    {
        return $this->sellerWalletAccount->user;
    }

    /**
     * Get coin attribute
     *
     * @return Coin
     */
    public function getCoinAttribute()
    {
        return $this->sellerWalletAccount->wallet->coin;
    }

    /**
     * Get confirmed status
     *
     * @return bool
     */
    public function getConfirmedAttribute()
    {
        return (bool) $this->confirmed_at;
    }

    /**
     * Get expires_at attribute
     *
     * @return Carbon
     */
    public function getExpiresAtAttribute()
    {
        return $this->created_at->addMinutes($this->time_limit);
    }

    /**
     * Check if trade is expired
     *
     * @return bool
     */
    public function getExpiredAttribute()
    {
        return $this->expires_at->isBefore(now());
    }

    /**
     * Get the timestamp after which trade is disputable
     *
     * @return Carbon|null
     */
    public function getDisputableFromAttribute()
    {
        return $this->confirmed_at?->addMinutes($this->time_limit);
    }

    /**
     * Get disputable attribute
     *
     * @return bool
     */
    public function getDisputableAttribute()
    {
        return $this->disputable_from?->isBefore(now());
    }

    /**
     * Check if trade is in progress
     *
     * @return bool
     */
    public function getInProgressAttribute()
    {
        return in_array($this->status, ['active', 'disputed']);
    }

    /**
     * Cancel trade
     *
     * @return bool
     */
    public function cancel()
    {
        return $this->update(['status' => 'canceled']);
    }

    /**
     * Confirm payment
     *
     * @return bool
     */
    public function confirm()
    {
        return $this->update(['confirmed_at' => now()]);
    }

    /**
     * Dispute trade
     *
     * @param User $user
     * @return bool
     */
    public function dispute(User $user)
    {
        $this->disputed_by = $this->getRole($user);
        return $this->update(["status" => "disputed"]);
    }

    /**
     * Complete trade
     *
     * @return bool
     */
    public function complete()
    {
        return $this->sellerWalletAccount->acquireLock(function (WalletAccount $sellerWalletAccount) {
            if ($sellerWalletAccount->getAvailableObject()->isNegative()) {
                throw new TransferException("Seller has negative balance.");
            }

            return DB::transaction(function () use ($sellerWalletAccount) {
                $description = $this->getTransferDescription();
                $sellerWalletAccount->debit($this->getTotalValueObject(), $description);

                $transferable = $this->getTotalValueObject()->subtract($this->getFeeValueObject());
                $operatorWalletAccount = $this->getOperatorWalletAccount();

                if ($this->getFeeValueObject()->isPositive() && $operatorWalletAccount) {
                    $operatorWalletAccount->credit($this->getFeeValueObject(), "[Fee] $description");
                }

                $this->buyerWalletAccount->credit($transferable, $description);

                return $this->update(['status' => 'completed']);
            });
        });
    }

    /**
     * Check if trade should auto cancel
     *
     * @return bool
     */
    public function shouldAutoCancel()
    {
        return $this->status === "active" && !$this->confirmed && $this->expired;
    }

    /**
     * Check if trade is cancelable by user
     *
     * @param User $user
     * @return bool
     */
    public function cancelableBy(User $user)
    {
        return match ($this->status) {
            "active" => $user->is($this->buyer),
            "disputed" => $user->can("manage_peer_trades"),
            default => false
        };
    }

    /**
     * Check if trade is confirmable by user
     *
     * @param User $user
     * @return bool
     */
    public function confirmableBy(User $user)
    {
        return $this->status === "active" &&
            $user->is($this->buyer) &&
            !$this->confirmed && !$this->expired;
    }

    /**
     * Check if trade can be disputed by user
     *
     * @param User $user
     * @return bool
     */
    public function disputableBy(User $user)
    {
        return $this->status === "active" &&
            ($user->is($this->buyer) || $user->is($this->seller)) &&
            $this->confirmed && $this->disputable;
    }

    /**
     * Check if buyer can be rated
     *
     * @param User $user
     * @return bool
     */
    public function buyerRatableBy(User $user)
    {
        return $this->status === "completed" && $user->is($this->seller);
    }

    /**
     * Check if seller can be rated
     *
     * @param User $user
     * @return bool
     */
    public function sellerRatableBy(User $user)
    {
        return $this->status === "completed" && $user->is($this->buyer);
    }

    /**
     * Check if trade is completable by user
     *
     * @param User $user
     * @return bool
     */
    public function completableBy(User $user)
    {
        $allowed = match ($this->status) {
            "active" => $user->is($this->seller),
            "disputed" => $user->can("manage_peer_trades"),
            default => false
        };

        return $this->confirmed && $allowed;
    }

    /**
     * Allow participation
     *
     * @param User $user
     * @return bool
     */
    public function allowParticipation(User $user)
    {
        return $user->can("manage_peer_trades") && $this->status === "disputed";
    }

    /**
     * Broadcast trade
     *
     * @param $event
     * @return array
     */
    public function broadcastOn($event)
    {
        return [$this];
    }

    /**
     * Get the data to broadcast for the model.
     *
     * @param string $event
     * @return array
     */
    public function broadcastWith($event)
    {
        return [
            "id"           => $this->id,
            "status"       => $this->status,
            "in_progress"  => $this->in_progress,
            "confirmed"    => $this->confirmed,
            "expired"      => $this->expired,
            "canceled_at"  => $this->canceled_at,
            "confirmed_at" => $this->confirmed_at,
            "completed_at" => $this->completed_at,
            "disputed_at"  => $this->disputed_at,
            "disputed_by"  => $this->disputed_by,
        ];
    }

    /**
     * Get role of user
     *
     * @param User $user
     * @return string|null
     */
    public function getRole(User $user)
    {
        return match (true) {
            $user->is($this->seller) => "seller",
            $user->is($this->buyer) => "buyer",
            default => null
        };
    }

    /**
     * Check if user is participant of the trade
     *
     * @param User $user
     * @return bool
     */
    public function hasParticipant(User $user)
    {
        return $this->conversation->participants()->where([
            'messageable_id'   => $user->getKey(),
            'messageable_type' => $user->getMorphClass(),
        ])->exists();
    }

    /**
     * Check if trade is visible to user
     *
     * @param User $user
     * @return bool
     */
    public function isVisibleTo(User $user): bool
    {
        return $user->is($this->seller) || $user->is($this->buyer) || $user->can("manage_peer_trades");
    }

    /**
     * Get operator wallet account
     *
     * @return WalletAccount|null
     */
    public function getOperatorWalletAccount()
    {
        return User::peerOperator()?->getWalletAccount($this->sellerWalletAccount->wallet);
    }

    /**
     * Scope inProgressOrCompleted query
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeInProgressOrCompleted($query)
    {
        return $query->whereIn('status', ['active', 'completed', 'disputed']);
    }

    /**
     * Scope inProgress query
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeInProgress($query)
    {
        return $query->whereIn('status', ['active', 'disputed']);
    }

    /**
     * Start conversation
     *
     * @return void
     * @throws Exception
     */
    public function sendAutoReply()
    {
        if ($this->offer?->auto_reply) {
            app(Chat::class)
                ->message($this->offer->auto_reply)
                ->from($this->offer->walletAccount->user)
                ->to($this->conversation)->send();
        }
    }

    /**
     * Get unread messages
     *
     * @param User $user
     * @return int
     */
    public function getUnreadMessages(User $user)
    {
        return app(Chat::class)
            ->conversation($this->conversation)
            ->setParticipant($user)
            ->unreadCount();
    }

    /**
     * Get transfer description
     *
     * @return string
     */
    protected function getTransferDescription()
    {
        return trans("peer-trade.description", [
            'id' => $this->short_id,
        ]);
    }

    /**
     * Retrieve the PeerTrade for a bound value.
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
            abort(404, trans('peer-trade.not_found'));
        }
    }

    /**
     * Chat conversation
     *
     * @return BelongsTo
     */
    public function conversation()
    {
        return $this->belongsTo(Conversation::class, "chat_conversation_id", "id");
    }

    /**
     * Buyer wallet account
     *
     * @return BelongsTo
     */
    public function buyerWalletAccount()
    {
        return $this->belongsTo(WalletAccount::class, 'buyer_wallet_account_id', 'id');
    }

    /**
     * Seller wallet account
     *
     * @return BelongsTo
     */
    public function sellerWalletAccount()
    {
        return $this->belongsTo(WalletAccount::class, 'seller_wallet_account_id', 'id');
    }

    /**
     * Related offer
     *
     * @return BelongsTo
     */
    public function offer()
    {
        return $this->belongsTo(PeerOffer::class, 'offer_id', 'id');
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
     *
     * @return BelongsTo
     */
    public function bankAccount()
    {
        return $this->belongsTo(BankAccount::class, 'bank_account_id', 'id');
    }

    /**
     * Seller rating
     *
     * @return BelongsTo
     */
    public function sellerRating()
    {
        return $this->belongsTo(Rating::class, 'seller_rating_id', 'id');
    }

    /**
     * Buyer rating
     *
     * @return BelongsTo
     */
    public function buyerRating()
    {
        return $this->belongsTo(Rating::class, 'buyer_rating_id', 'id');
    }
}
