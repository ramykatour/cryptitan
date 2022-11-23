<?php

namespace App\Http\Controllers\Wallet;

use App\Http\Controllers\Controller;
use App\Http\Requests\VerifiedRequest;
use App\Http\Resources\TransferRecordResource;
use App\Http\Resources\WalletAccountResource;
use App\Http\Resources\WalletAddressResource;
use App\Models\TransferRecord;
use App\Models\Wallet;
use App\Models\WalletAccount;
use Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class AccountController extends Controller
{
    /**
     * Get all wallet accounts
     *
     * @return AnonymousResourceCollection
     */
    public function all()
    {
        $accounts = $this->walletAccounts()->get()
            ->tap(function ($accounts) use (&$totalAvailablePrice) {
                $totalAvailablePrice = $accounts->sum('available_price');
            })
            ->each(function ($account) use ($totalAvailablePrice) {
                $divisor = $totalAvailablePrice > 0 ? $totalAvailablePrice : 1;
                $quota = ceil(($account->available_price * 100) / $divisor);
                $account->setAttribute('available_price_quota', $quota);
            });

        return WalletAccountResource::collection($accounts);
    }

    /**
     * Get total available price
     *
     * @return JsonResponse
     */
    public function totalAvailablePrice()
    {
        $price = $this->walletAccounts()
            ->get()->sum('available_price');

        $formattedPrice = formatCurrency($price, Auth::user()->currency);

        return response()->json([
            'price'          => $price,
            'formattedPrice' => $formattedPrice,
        ]);
    }

    /**
     * Get aggregate price
     *
     * @return array
     */
    public function aggregatePrice()
    {
        $accounts = $this->walletAccounts()->get();

        $available = $accounts->sum('available_price');
        $formattedAvailable = formatCurrency($available, Auth::user()->currency);

        $balanceOnTrade = $accounts->sum('balance_on_trade_price');
        $formattedBalanceOnTrade = formatCurrency($balanceOnTrade, Auth::user()->currency);

        $balance = $accounts->sum('balance_price');
        $formattedBalance = formatCurrency($balance, Auth::user()->currency);

        return [
            'available'                  => $available,
            'formatted_available'        => $formattedAvailable,
            'balance_on_trade'           => $balanceOnTrade,
            'formatted_balance_on_trade' => $formattedBalanceOnTrade,
            'balance'                    => $balance,
            'formatted_balance'          => $formattedBalance,
        ];
    }

    /**
     * Estimate transaction fee
     *
     * @param Request $request
     * @param $id
     * @return JsonResponse
     * @throws ValidationException
     * @throws \Exception
     */
    public function estimateFee(Request $request, $id)
    {
        $account = $this->getWalletAccount($id);

        $this->validate($request, [
            'amount'  => 'nullable|numeric|min:0',
            'address' => 'nullable|string|min:0'
        ]);

        $currency = $account->user->currency;
        $amount = $account->parseCoin($request->get('amount') ?: 0);
        $address = $request->get('address');

        if ($this->checkInternalAddress($account->wallet, $address)) {
            return response()->json(null);
        }

        $withdrawalFee = $account->getWithdrawalFee($amount);
        $transactionFee = $account->getTransactionFee($amount);
        $estimateFee = $transactionFee->add($withdrawalFee);

        return response()->json([
            'price' => $estimateFee->getFormattedPrice($currency),
            'value' => $estimateFee->getValue(),
        ]);
    }

    /**
     * Send amount
     *
     * @param VerifiedRequest $request
     * @param $id
     * @return TransferRecordResource
     */
    public function send(VerifiedRequest $request, $id)
    {
        return Auth::user()->acquireLock(function () use ($request, $id) {
            $account = $this->walletAccounts()->findOrFail($id);

            $data = $this->validate($request, [
                'amount'  => [
                    'required', 'numeric',
                    "min:{$account->min_transferable}",
                    "max:{$account->max_transferable}",
                ],
                'address' => ['required'],
            ]);

            $record = $account->send($data['amount'], $data['address']);

            if (!$record instanceof TransferRecord) {
                abort(403, trans('wallet.account_in_use'));
            }

            return TransferRecordResource::make($record);
        });
    }

    /**
     * Get latest address
     *
     * @param $id
     * @return WalletAddressResource
     */
    public function latestAddress($id)
    {
        $address = $this->walletAccounts()->findOrFail($id)
            ->walletAddresses()->latest()->first();

        return WalletAddressResource::make($address);
    }

    /**
     * Generate address
     *
     * @param $id
     * @return WalletAddressResource
     * @throws \Exception
     */
    public function generateAddress($id)
    {
        $account = $this->walletAccounts()->findOrFail($id);

        return $account->acquireLock(function () use ($account) {
            $latest = $account->walletAddresses()->latest()->first();

            if ($latest && !$latest->total_received) {
                abort(403, trans('wallet.last_address_not_used'));
            }

            $address = $account->wallet->createAddress($account);

            return WalletAddressResource::make($address);
        });
    }

    /**
     * Check if address is internal
     *
     * @param Wallet $wallet
     * @param $address
     * @return bool
     */
    public function checkInternalAddress(Wallet $wallet, $address)
    {
        return filter_var($address, FILTER_VALIDATE_EMAIL) || $wallet->addresses()->whereAddress($address)->exists();
    }

    /**
     * Get wallet account by id
     *
     * @param $id
     * @return WalletAccount
     */
    public function getWalletAccount($id)
    {
        return $this->walletAccounts()->findOrFail((int) $id);
    }

    /**
     * Get authenticated user's wallet account
     *
     * @return \App\Models\WalletAccount|\Illuminate\Database\Eloquent\Relations\HasMany
     */
    private function walletAccounts()
    {
        return Auth::user()->walletAccounts();
    }
}
