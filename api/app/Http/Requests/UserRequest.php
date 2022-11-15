<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use \Symfony\Component\HttpFoundation\Response;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => [
                'required',
                'unique:users,email'
            ],
            'password' => [
                'required',
            ]
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'email.required' => 'メールアドレスは必須項目です。',
            'email.unique' => 'このメールアドレスは既に使われています。',
            'password.required' => 'パスワードは必須項目です。',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $res = response()->json([
            'errors' => $validator->errors(),
            ], Response::HTTP_BAD_REQUEST);
        throw new HttpResponseException($res);
    }
}
