<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/user/regist', [App\Http\Controllers\UserController::class, 'register']);

Route::post('/user/register', [App\Http\Controllers\UserController::class, 'mainRegister']);

Route::post('/user/login', [App\Http\Controllers\UserController::class, 'validateLogin']);

Route::post('/user/get/info', [App\Http\Controllers\UserController::class, 'getUserInfo']);