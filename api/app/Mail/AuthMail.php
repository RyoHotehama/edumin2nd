<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AuthMail extends Mailable
{
    use Queueable, SerializesModels;
    protected $url;
    protected $email;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($url, $email)
    {
        $this->url = $url;
        $this->email = $email;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mail.register')
                    ->subject('【Edumin】仮登録が完了しました')
                    ->with(['url'=>$this->url])
                    ->with(['email'=>$this->email]);
    }
}
