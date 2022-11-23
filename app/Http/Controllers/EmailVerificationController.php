<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmailVerificationRequest;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    /**
     * Send email
     *
     * @param Request $request
     */
    public function sendEmail(Request $request)
    {
        $request->user()->sendEmailVerificationNotification();
    }

    /**
     * Verify email
     *
     * @param EmailVerificationRequest $request
     * @return mixed
     */
    public function verify(EmailVerificationRequest $request)
    {
        $request->fulfill();

        return redirect()->route('main')->notify(trans('verification.email_verified'), 'success');
    }
}
