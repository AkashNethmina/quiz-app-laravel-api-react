<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'      => $this->id,
            'quiz_id' => $this->quiz_id,
            'body'    => $this->body,
            'type'    => $this->type,
            'order'   => $this->order,
            'options' => OptionResource::collection($this->whenLoaded('options')),
        ];
    }
}
