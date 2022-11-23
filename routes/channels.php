<?php

use App\Models\PeerTrade;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;
use Musonza\Chat\Models\Conversation;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.PeerTrade.{trade}', function (User $user, PeerTrade $trade) {
    return $trade->isVisibleTo($user);
});

Broadcast::channel('App.Models.User.{id}', function (User $user, $id) {
    return $user->id === (int) $id;
});

Broadcast::channel('Conversation.{conversation}', function (User $user, Conversation $conversation) {
    $participation = $conversation->participants()->where([
        'messageable_id'   => $user->getKey(),
        'messageable_type' => $user->getMorphClass(),
    ])->first();

    return $participation?->messageable->getParticipantDetails();
});
