<?php

namespace App\Http\Resources;

use App\Models\PeerPaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PeerPaymentMethod
 */
class PeerPaymentMethodResource extends JsonResource
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
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'category'    => PeerPaymentCategoryResource::make($this->whenLoaded('category'))
        ];
    }
}
