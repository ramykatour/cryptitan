<?php

namespace App\Notifications;

use App\Models\PeerTrade;
use App\Notifications\Traits\Notifier;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class PeerTradeStarted extends Notification implements ShouldQueue
{
    use Queueable, Notifier;

    /**
     * @var PeerTrade
     */
    protected $trade;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(PeerTrade $trade)
    {
        $this->trade = $trade;
    }

    /**
     * Replacement Parameters and Values
     *
     * @param $notifiable
     * @return array
     */
    protected function parameters($notifiable)
    {
        return [
            'id'               => $this->trade->short_id,
            'status'           => $this->trade->status,
            'coin'             => $this->trade->coin->name,
            'value'            => $this->trade->value,
            'formatted_amount' => $this->trade->formatted_amount,
            'currency'         => $this->trade->currency,
        ];
    }
}
