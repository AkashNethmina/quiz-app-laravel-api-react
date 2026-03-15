<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class StoreQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'body'               => ['required', 'string'],
            'type'               => ['required', 'in:mcq,true_false'],
            'order'              => ['integer', 'min:0'],
            'options'            => ['required', 'array', 'min:2'],
            'options.*.body'     => ['required', 'string'],
            'options.*.is_correct' => ['required', 'boolean'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new ValidationException($validator);
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v) {
            $type    = $this->input('type');
            $options = $this->input('options', []);

            if (! is_array($options)) {
                return;
            }

            $correctCount = collect($options)->filter(fn ($o) => ! empty($o['is_correct']))->count();

            if ($type === 'mcq') {
                if ($correctCount !== 1) {
                    $v->errors()->add('options', 'MCQ questions must have exactly 1 correct option.');
                }
            }

            if ($type === 'true_false') {
                if (count($options) !== 2) {
                    $v->errors()->add('options', 'True/False questions must have exactly 2 options.');
                }

                if ($correctCount !== 1) {
                    $v->errors()->add('options', 'True/False questions must have exactly 1 correct option.');
                }

                $bodies = collect($options)->pluck('body')->map(fn ($b) => trim((string) $b))->sort()->values()->all();
                if ($bodies !== ['False', 'True']) {
                    $v->errors()->add('options', "True/False option bodies must be exactly 'True' and 'False'.");
                }
            }
        });
    }
}
