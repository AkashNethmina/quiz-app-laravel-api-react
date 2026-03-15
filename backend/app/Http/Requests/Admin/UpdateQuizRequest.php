<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'              => ['sometimes', 'required', 'string', 'max:255'],
            'description'        => ['sometimes', 'nullable', 'string'],
            'time_limit'         => ['sometimes', 'required', 'integer', 'min:10'],
        ];
    }
}
