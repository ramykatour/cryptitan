<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class TwoFactorVerification
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return Response|RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()->isTwoFactorEnabled()) {
            $request->validate([
                'token' => [
                    'required', 'string', 'max:100',
                    function ($attribute, $value, $fail) use ($request) {
                        if (!$request->user()->verifyTwoFactorToken($value)) {
                            $fail(trans('auth.invalid_token'));
                        }
                    },
                ],
            ]);
        } else {
            $request->validate([
                'password' => [
                    'required', 'string', 'max:100',
                    function ($attribute, $value, $fail) use ($request) {
                        if (!Hash::check($value, $request->user()->password)) {
                            $fail(trans('auth.invalid_password'));
                        }
                    },
                ],
            ]);
        }

        return $next($request);
    }
}
