<?php

namespace App\Policies;

use App\Models\PeerOffer;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PeerOfferPolicy
{
    use HandlesAuthorization;

    /**
     * Can enable offer
     *
     * @param User $user
     * @param PeerOffer $offer
     * @return bool
     */
    public function enable(User $user, PeerOffer $offer): bool
    {
        return $offer->canEnableBy($user);
    }

    /**
     * Can disable offer
     *
     * @param User $user
     * @param PeerOffer $offer
     * @return bool
     */
    public function disable(User $user, PeerOffer $offer): bool
    {
        return $offer->canDisableBy($user);
    }

    /**
     * Can close offer
     *
     * @param User $user
     * @param PeerOffer $offer
     * @return bool
     */
    public function close(User $user, PeerOffer $offer): bool
    {
        return $offer->canCloseBy($user);
    }

    /**
     * Can trade with offer
     *
     * @param User $user
     * @param PeerOffer $offer
     * @return bool
     */
    public function tradable(User $user, PeerOffer $offer): bool
    {
        return $offer->canTradeWith($user);
    }
}
