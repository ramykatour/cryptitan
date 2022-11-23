<?php

namespace App\Http\Resources;

use App\Models\PeerTrade;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PeerTrade
 */
class PeerTradeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        if (is_null($this->resource)) {
            return [];
        }

        return [
            'id'                   => $this->id,
            'currency'             => $this->currency,
            'price'                => $this->price,
            'formatted_price'      => $this->formatted_price,
            'amount'               => $this->amount,
            'formatted_amount'     => $this->formatted_amount,
            'status'               => $this->status,
            'instruction'          => $this->instruction,
            'value'                => $this->value,
            'total_value'          => $this->total_value,
            'fee_value'            => $this->fee_value,
            'time_limit'           => $this->time_limit,
            'confirmed'            => $this->confirmed,
            'expires_at'           => $this->expires_at,
            'expired'              => $this->expired,
            'in_progress'          => $this->in_progress,
            'canceled_at'          => $this->canceled_at,
            'confirmed_at'         => $this->confirmed_at,
            'completed_at'         => $this->completed_at,
            'disputed_at'          => $this->disputed_at,
            'disputed_by'          => $this->disputed_by,
            'payment'              => $this->payment,
            'chat_conversation_id' => $this->chat_conversation_id,
            'disputable_from'      => $this->disputable_from,
            'cancelable'           => $this->cancelableBy($request->user()),
            'confirmable'          => $this->confirmableBy($request->user()),
            'completable'          => $this->completableBy($request->user()),
            'disputable'           => $this->disputableBy($request->user()),
            'role'                 => $this->getRole($request->user()),
            'bank_account'         => BankAccountResource::make($this->whenLoaded('bankAccount')),
            'payment_method'       => PeerPaymentMethodResource::make($this->whenLoaded('paymentMethod')),
            'buyer_rating'         => RatingResource::make($this->whenLoaded('buyerRating')),
            'seller_rating'        => RatingResource::make($this->whenLoaded('sellerRating')),
            'buyer'                => UserResource::make($this->whenAppended('buyer')),
            'seller'               => UserResource::make($this->whenAppended('seller')),
            'coin'                 => CoinResource::make($this->whenAppended('coin')),
            'created_at'           => $this->created_at,
            'updated_at'           => $this->updated_at,

            $this->mergeWhen($this->hasParticipant($request->user()), [
                'unread_messages' => $this->getUnreadMessages($request->user())
            ]),

            $this->mergeWhen($request->user()->can("manage_peer_trades"), [
                'is_participant' => $this->hasParticipant($request->user()),
            ]),
        ];
    }
}
