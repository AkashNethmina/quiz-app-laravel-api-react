<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'title'               => $this->title,
            'description'         => $this->description,
            'time_limit_seconds'  => $this->time_limit_seconds,
            'is_published'        => $this->is_published,
            'questions_count'     => $this->whenCounted('questions'),
            'created_at'          => $this->created_at,
            'questions'           => QuestionResource::collection($this->whenLoaded('questions')),
        ];
    }
}
