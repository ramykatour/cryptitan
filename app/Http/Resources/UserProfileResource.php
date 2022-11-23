<?php

namespace App\Http\Resources;

use App\Models\UserProfile;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin UserProfile
 */
class UserProfileResource extends JsonResource
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
            'last_name'  => $this->last_name,
            'first_name' => $this->first_name,
            'full_name'  => $this->full_name,
            'bio'        => $this->bio,
            'picture'    => $this->picture,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            $this->mergeWhen($request->user()?->canViewUser($this->user), [
                'is_complete' => $this->is_complete,
                'dob'         => $this->dob,
            ]),
        ];
    }
}
