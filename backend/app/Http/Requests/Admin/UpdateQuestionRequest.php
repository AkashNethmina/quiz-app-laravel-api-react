<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class UpdateQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question_text'      => ['sometimes', 'required', 'string'],
            'type'               => ['sometimes', 'required', 'in:mcq,true_false'],
            'order'              => ['sometimes', 'integer', 'min:0'],
            'options'            => ['sometimes', 'required', 'array', 'min:2'],
            'options.*.option_text'=> ['required_with:options', 'string'],
            'options.*.is_correct' => ['required_with:options', 'boolean'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new ValidationException($validator);
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v) {
            // Only run cross-field rules when options are being updated
            if (! $this->has('options')) {
                return;
            }

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

                $bodies = collect($options)->pluck('option_text')->map(fn ($b) => trim((string) $b))->sort()->values()->all();
                if ($bodies !== ['False', 'True']) {
                    $v->errors()->add('options', "True/False option bodies must be exactly 'True' and 'False'.");
                }
            }
        });
    }
}
