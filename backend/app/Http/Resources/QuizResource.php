<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'title'               => $this->title,
            'description'         => $this->description,
            'time_limit'          => $this->time_limit_seconds,
            'is_published'        => $this->is_published,
            'questions_count'     => $this->whenCounted('questions'),
            'attempts_count'      => $this->whenCounted('attempts'),
            'created_at'          => $this->created_at,
        ];
    }
}
