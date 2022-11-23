<?php

namespace App\Notifications\Auth;

use App\Models\User;
use App\Notifications\Traits\Notifier;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class EmailToken extends Notification implements ShouldQueue
{
    use Queueable, Notifier;

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return settings()->get('enable_mail') ? ['mail'] : [];
    }

    /**
     * Replacement Parameters and Values
     *
     * @param User $notifiable
     * @return array
     */
    protected function parameters($notifiable)
    {
        $token = $notifiable->generateEmailToken();

        return [
            'code'      => $token['token'],
            'minutes'   => $token['duration'],
        ];
    }
}
