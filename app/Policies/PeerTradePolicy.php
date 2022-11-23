<?php

namespace App\Policies;

use App\Models\PeerTrade;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PeerTradePolicy
{
    use HandlesAuthorization;

    /**
     * View trade
     *
     * @param User $user
     * @param PeerTrade $trade
     * @return bool
     */
    public function view(User $user, PeerTrade $trade): bool
    {
        return $trade->hasParticipant($user);
    }

    /**
     * Send message
     *
     * @param User $user
     * @param PeerTrade $trade
     * @return bool
     */
    public function sendMessage(User $user, PeerTrade $trade): bool
    {
        return $trade->in_progress && $trade->hasParticipant($user);
    }

    /**
     * Cancel trade
     *
     * @param User $user
     * @param PeerTrade $trade
     * @return bool
     */
    public function cancel(User $user, PeerTrade $trade): bool
    {
        return $trade->cancelableBy($user);
    }

    /**
     * Confirm trade
     *
     * @param User $user
     * @param PeerTrade $trade
     * @return bool
     */
    public function confirm(User $user, PeerTrade $trade): bool
    {
        return $trade->confirmableBy($user);
    }

    /**
     * Dispute trade
     *
     * @param User $user
     * @param PeerTrade $trade
     * @return bool
     */
    public function dispute(User $user, PeerTrade $trade): bool
    {
        return $trade->disputableBy($user);
    }

    /**
     * Complete trade
     *
     * @param User $user
     * @param PeerTrade $trade
     * @return bool
     */
    public function complete(User $user, PeerTrade $trade): bool
    {
        return $trade->completableBy($user);
    }

    /**
     * Allow user to join trade
     *
     * @param User $user
     * @param PeerTrade $trade
     * @return bool
     */
    public function join(User $user, PeerTrade $trade): bool
    {
        return !$trade->hasParticipant($user) && $trade->allowParticipation($user);
    }

    /**
     * Can rate seller
     *
     * @param User $user
     * @param PeerTrade $trade
     * @return bool
     */
    public function rateSeller(User $user, PeerTrade $trade): bool
    {
        return $trade->sellerRatableBy($user);
    }

    /**
     * Can rate buyer
     *
     * @param User $user
     * @param PeerTrade $trade
     * @return bool
     */
    public function rateBuyer(User $user, PeerTrade $trade): bool
    {
        return $trade->buyerRatableBy($user);
    }
}
