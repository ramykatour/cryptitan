<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPendingPaymentTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GatewayController extends Controller
{
    /**
     * Handle gateway callback
     *
     * @param Request $request
     * @param $order
     * @return mixed
     */
    public function handleCallback(Request $request, $order)
    {
        if ($request->get('status') !== 'success') {
            return redirect()->route('main')->notify(trans('payment.canceled'), 'error');
        }

        $transaction = Auth::user()->getPaymentAccount()->transactions()->findOrFail($order);

        ProcessPendingPaymentTransaction::dispatch($transaction);

        return redirect()->route('main')->notify(trans('payment.approved'), 'success');
    }
}
