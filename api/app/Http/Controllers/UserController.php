<?php

namespace App\Http\Controllers;

use Datetime;
use Exception;
use App\Models\User;
use App\Mail\AuthMail;
use App\Models\UserToken;
use Illuminate\Http\Request;
use App\Models\UserLoginToken;
use App\Http\Requests\UserRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cookie;
use App\Http\Requests\UserLoginRequest;
use \Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    /**
     * 会員情報仮登録API
     *
     * @param  \App\Http\Requests\UserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function register(UserRequest $request)
    {
        $user = new User;
        $form = $request->all();
        $email = $form['email'];
        try {
            DB::beginTransaction();
            // ユーザーデータ登録
            $user->fill($form)->save();
            // トークンを発行
            $token = $this->setToken($email);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json(false, Response::HTTP_BAD_REQUEST);
        }

        // デコード
        $email = base64_decode($email);

        // メールを送信
        $url = env('FRONTEND_URL'). "/user/confirm?token=". $token;
        Mail::to($email)->send(new AuthMail($url, $email));

        return response()->json(true, Response::HTTP_OK);
    }

    /**
     * 会員情報登録API
     *
     * @param  \App\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function mainRegister(Request $request)
    {
        $token = $request->token;

        // トークンチェック
        $result = $this->checkToken($token);

        if ($result === 'OK') {
            return response()->json('登録完了しました。ログインを行なって下さい。', Response::HTTP_OK);
        } elseif ($result === 'ALREADY') {
            return response()->json('このメールアドレスはすでに認証されています。ログインを行なって下さい。', Response::HTTP_BAD_REQUEST);
        } elseif ($result === 'WRONG') {
            return response()->json('メールアドレス認証に失敗しました。URLを確認してもう一度やり直してください。', Response::HTTP_BAD_REQUEST);
        } elseif ($result === 'EXPIRE') {
            return response()->json('認証URLの有効期限が切れています。最初からもう一度やり直してください。', Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * トークンをセット
     *
     * @param $email メールアドレス
     * @return $token トークン
     */
    private function setToken($email)
    {
        $now = new DateTime();
        $now->format("Y-m-d H:i:s");
        // 有効期限を計算(30分とした)
        $expire_at = $now->modify('+30 minutes');

        $userToken = new UserToken();
        // トークンを生成
        $token = uniqid('', true);
        // トークンをDBに保存
        $userToken->create([
            'token' => $token,
            'email' => $email,
            'expire_at' => $expire_at
        ]);

        return $token;
    }

    /**
     * トークンをチェック
     *
     * @param $token メールアドレス
     * @return トークンチェック結果
     */
    public function checkToken($token)
    {
        $now = new DateTime();

        // ユーザから送信されたトークンを検索
        $data = UserToken::where([
            'token' => $token
        ])->first();

        // トークンチェック
        if (is_null($data)) {
            //DBから値が返ってこないのでトークンが間違っている、チェックNG
            return "WRONG";
        } elseif ($data->token_flg === 1) {
            //検索して見つかったトークンデータの認証フラグが既に立っている(=認証済み)、チェックNG
            return "ALREADY";
        }

        $expire_date = new DateTime($data->expire_at);

        // 認証処理(有効なトークンだった場合はフラグを認証済み(true)に更新)
        if ($now < $expire_date) {
            try {
                DB::beginTransaction();
                // フラグの更新
                $data->token_flg = 1;
                $data->update();

                // フラグの更新
                User::where(
                    'email', '=', $data->email
                )->update(['auth_flg' => '1']);

                DB::commit();
            } catch (Exception $e) {
                DB::rollBack();

                return "WRONG";
            }

            return "OK";
        } else {
            //有効期限が切れている、チェックNG
            //有効期限の切れたトークンデータ、ユーザデータはもう二度と認証できないので削除
            $email = $data->email;
            try {
                DB::beginTransaction();
                UserToken::where([
                    'token' => $token
                ])->delete();

                User::where([
                    'email' => $email
                ])->delete();
                DB::commit();
            } catch (Exception $e) {
                DB::rollBack();
            }

            return "EXPIRE";
        }
    }

    /**
     * ログインチェックAPI
     *
     * @param  \App\Http\Requests\UserLoginRequest $request
     * @return \Illuminate\Http\Response
     */
    public function validateLogin(UserLoginRequest $request)
    {
        $user = User::select('id')->where(['email' => $request->email])->where(['password' => $request->password])->where(['auth_flg' => 1])->first();

        if (empty($user)) {
            response()->json([
                'errors' => [
                    'email' => 'メールアドレスまたはパスワードが違います。'
                ],
            ],Response::HTTP_BAD_REQUEST);
        }

        // トークンの作成
        $token = uniqid(mt_rand());

        // 一度ログインしたことのあるユーザーはtokenのアップデート、,初めてのログインは、tokenの作成
        $userToken = new UserLoginToken();
        if ($userToken->where(['user_id' => $user->id])->first()) {
            $userToken->where(['user_id' => $user->id])->update(['token' => $token]);
        } else {
            $userToken->token = $token;
            $userToken->user_id = $user->id;
            $userToken->save();
        }

        // クッキーの作成
        $cookie = Cookie::make('token', $token, 60*24, '/', '', true, true);

        return response()->json(true, Response::HTTP_OK)->cookie($cookie);
    }

    /**
     * ユーザー情報取得API
     *
     * @param  \App\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function getUserInfo(Request $request)
    {
        $userToken = UserLoginToken::select('user_id')->where(['token' => $request->token])->first();
        if (empty($userToken)) {
            response()->json([
                'errors' => 'ユーザー情報の取得に失敗しました。'
            ],Response::HTTP_BAD_REQUEST);
        }
        $userInfo = User::find($userToken->user_id)->first();

        if (empty($userInfo)) {
            response()->json([
                'errors' => 'ユーザー情報の取得に失敗しました。'
            ],Response::HTTP_BAD_REQUEST);
        }

        return response()->json($userInfo, Response::HTTP_OK);
    }
}
