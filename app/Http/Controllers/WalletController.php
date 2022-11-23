<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransferRecordResource;
use App\Http\Resources\WalletAccountResource;
use App\Http\Resources\WalletResource;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class WalletController extends Controller
{
    /**
     * Add account with wallet
     *
     * @param Wallet $wallet
     * @return \App\Models\WalletAccount|mixed
     */
    public function createAccount(Wallet $wallet)
    {
        return Auth::user()->acquireLock(function (User $user) use ($wallet) {
            return WalletAccountResource::make($wallet->getAccount($user));
        });
    }

    /**
     * Get all wallet unused by this user
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function unused()
    {
        $used = Auth::user()->walletAccounts()->get()
            ->pluck('wallet_id')->toArray();

        $wallets = Wallet::whereNotIn('id', $used)->get();

        return WalletResource::collection($wallets);
    }

    /**
     * Paginate transfer record
     *
     * @param Request $request
     * @return mixed
     */
    public function transferRecordPaginate(Request $request)
    {
        $query = Auth::user()->transferRecords()->latest();

        if ($account = $request->query('account')) {
            $query = $query->where('wallet_accounts.id', $account);
        }

        return TransferRecordResource::collection(paginate($query));
    }

    /**
     * Get market chart
     *
     * @param Request $request
     * @param Wallet $wallet
     * @return Collection
     * @throws ValidationException
     */
    public function marketChart(Request $request, Wallet $wallet)
    {
        $validated = $this->validate($request, [
            'range' => 'required|in:hour,day,week,month,year'
        ]);

        return $wallet->marketChart($validated['range'], Auth::user()->currency);
    }

    /**
     * Get price
     *
     * @param Wallet $wallet
     * @return array
     */
    public function price(Wallet $wallet)
    {
        $unitObject = $wallet->getUnitObject();
        $currency = Auth::user()->currency;

        return [
            'price'           => $unitObject->getPrice($currency),
            'formatted_price' => $unitObject->getFormattedPrice($currency),
            'change'          => $wallet->getPriceChange(),
        ];
    }
}
