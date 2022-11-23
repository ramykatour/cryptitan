<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Musonza\Chat\Models\Message;

/**
 * @mixin Message
 */
class ChatMessageResource extends JsonResource
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
            'id'            => $this->id,
            'body'          => $this->body,
            'type'          => $this->type,
            'data'          => $this->data,
            'is_sender'     => $this->participation->messageable->is($request->user()),
            'conversation'  => ChatConversationResource::make($this->whenLoaded('conversation')),
            'participation' => ChatParticipationResource::make($this->participation),
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,
        ];
    }
}
