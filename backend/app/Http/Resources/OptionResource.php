<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isAdmin = $request->user()?->role === 'admin';

        return [
            'id'         => $this->id,
            'body'       => $this->body,
            'is_correct' => $this->when($isAdmin, $this->is_correct),
        ];
    }
}
