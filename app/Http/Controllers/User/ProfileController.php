<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\PeerOfferResource;
use App\Http\Resources\RatingResource;
use App\Http\Resources\UserResource;
use App\Models\PeerOffer;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Get user by name
     *
     * @param User $user
     * @return UserResource
     */
    public function get(User $user)
    {
        return UserResource::make($user->loadCount(['followers', 'following']));
    }

    /**
     * Follow user
     *
     * @param User $user
     * @return void
     */
    public function follow(User $user)
    {
        $this->assertFollowable($user);

        Auth::user()->following()->sync($user, false);
    }

    /**
     * Unfollow user
     *
     * @param User $user
     * @return void
     */
    public function unfollow(User $user)
    {
        $this->assertFollowable($user);

        Auth::user()->following()->detach($user);
    }

    /**
     * Paginate followers
     *
     * @param User $user
     * @return AnonymousResourceCollection
     */
    public function followersPaginate(User $user)
    {
        $records = paginate($user->followers());
        return UserResource::collection($records);
    }

    /**
     * Paginate following
     *
     * @param User $user
     * @return AnonymousResourceCollection
     */
    public function followingPaginate(User $user)
    {
        $records = paginate($user->following());
        return UserResource::collection($records);
    }

    /**
     * Paginate reviews
     *
     * @param User $user
     * @return AnonymousResourceCollection
     */
    public function reviewsPaginate(User $user)
    {
        $records = paginate($user->ratings()->whereNotNull("comment"));
        return RatingResource::collection($records);
    }

    /**
     * Get paginated PeerOffers created by user
     *
     * @param User $user
     * @param $type
     * @return AnonymousResourceCollection
     */
    public function peerOfferPaginate(User $user, $type)
    {
        $query = PeerOffer::whereType($type)->ownedBy($user);

        if (Auth::user()->isNot($user) && Auth::user()->cannot("manage_peer_trades")) {
            $query->displayedFor(Auth::user());
        }

        return PeerOfferResource::collection(paginate($query));
    }

    /**
     * Assert if user is followable
     *
     * @param User $user
     * @return void
     */
    protected function assertFollowable(User $user): void
    {
        if (Auth::user()->cannotFollow($user)) {
            abort(403, trans('auth.action_forbidden'));
        }
    }
}
