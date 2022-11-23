<?php

namespace App\Http\Resources;

use App\Models\RequiredDocument;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin RequiredDocument
 */
class RequiredDocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
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
            'status'      => $this->status,
            'created_at'  => $this->created_at,

            $this->mergeWhen($request->user()?->can('manage_settings'), [
                'pending_count'  => $this->whenNotNull($this->pending_count),
                'approved_count' => $this->whenNotNull($this->approved_count),
                'rejected_count' => $this->whenNotNull($this->rejected_count),
            ]),
        ];
    }
}
