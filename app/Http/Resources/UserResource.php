<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        if (is_null($this->resource)) {
            return [];
        }

        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'presence'          => $this->presence,
            'followers_count'   => $this->whenNotNull($this->followers_count),
            'following_count'   => $this->whenNotNull($this->following_count),
            'profile'           => UserProfileResource::make($this->whenLoaded('profile')),
            'last_seen_at'      => $this->last_seen_at,
            'last_login_at'     => $this->last_login_at,
            'currency'          => $this->currency,
            'currency_name'     => $this->currency_name,
            'country'           => $this->country,
            'average_rating'    => $this->average_rating,
            'sum_rating'        => $this->sum_rating,
            'total_rating'      => $this->total_rating,
            'active'            => $this->active,
            'long_term'         => $this->long_term,
            'country_name'      => $this->country_name,
            'phone_verified_at' => $this->phone_verified_at,
            'email_verified_at' => $this->email_verified_at,
            'followable'        => $request->user()?->canFollow($this->resource),
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,

            $this->mergeWhen($request->user()?->canViewUser($this->resource), [
                'email'                 => $this->email,
                'phone'                 => $this->phone,
                'two_factor_enable'     => $this->two_factor_enable,
                'rank'                  => $this->rank,
                'country_operation'     => $this->country_operation,
                'deactivated_until'     => $this->deactivated_until,
                'notifications_read_at' => $this->notifications_read_at,
                'location'              => $this->location,
                'is_super_admin'        => $this->is_super_admin,
                'all_permissions'       => $this->all_permissions,
                'all_roles'             => $this->all_roles,
            ]),

            $this->mergeWhen($request->user()?->isNot($this->resource), [
                'following' => $request->user()->getFollowingPivot($this->resource)
            ]),

            'updatable' => $request->user()->canUpdateUser($this->resource),
            'deletable' => $request->user()->canDeleteUser($this->resource),
        ];
    }
}
