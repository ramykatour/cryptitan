<?php

namespace App\Console\Commands;

use App\Models\PaymentAccount;
use App\Models\SupportedCurrency;
use App\Models\Wallet;
use App\Models\WalletAccount;
use Illuminate\Console\Command;

class UpdateStatistics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'statistics:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update system statistics';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int|void
     */
    public function handle()
    {
        $this->updateSupportedCurrencyStatistics();
        $this->updateWalletStatistics();
    }

    /**
     * Update Supported Currency statistics
     *
     * @return void
     */
    protected function updateSupportedCurrencyStatistics()
    {
        SupportedCurrency::all()->each(function (SupportedCurrency $currency) {
            $accounts = $currency->paymentAccounts()->get();
            $statistics = $currency->statistic()->firstOrNew();

            $statistics->balance = $accounts->sum(function (PaymentAccount $account) {
                $query = $account->transactions()->completed();
                return $query->latest()->first()->balance ?? 0;
            });

            $statistics->balance_on_trade = $accounts->sum('balance_on_trade');

            $currency->statistic()->save($statistics);
        });
    }

    /**
     * Update wallet statistics
     *
     * @return void
     */
    protected function updateWalletStatistics()
    {
        Wallet::all()->each(function (Wallet $wallet) {
            $accounts = $wallet->accounts()->get();
            $statistics = $wallet->statistic()->firstOrNew();

            $statistics->balance = $accounts->sum(function (WalletAccount $account) {
                $query = $account->transferRecords()->confirmed();
                return $query->latest()->first()->balance ?? 0;
            });

            $statistics->balance_on_trade = $accounts->sum('balance_on_trade');

            $wallet->statistic()->save($statistics);
        });
    }
}
