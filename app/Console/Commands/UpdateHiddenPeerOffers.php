<?php

namespace App\Console\Commands;

use App\Models\PeerOffer;
use App\Models\WalletAccount;
use Illuminate\Console\Command;
use Illuminate\Support\LazyCollection;

class UpdateHiddenPeerOffers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'peer-offers:update-hidden';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shows all sell offers that can be fulfilled.';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $this->getRecords()->each(function (PeerOffer $offer) {
            $offer->walletAccount->acquireLock(function (WalletAccount $account) use ($offer) {
                $offer->acquireLock(function (PeerOffer $offer) use ($account) {
                    if ($offer->getMaxValueObject()->lessThan($account->getAvailableObject())) {
                        return tap($offer)->update(['display' => true]);
                    } else if (now()->diffInDays($offer->updated_at) >= 7) {
                        return tap($offer)->update(['closed_at' => now()]);
                    }
                });
            });
        });
    }

    /**
     * Get records
     *
     * @return LazyCollection
     */
    protected function getRecords()
    {
        return PeerOffer::whereType("sell")->opened()
            ->where("display", false)->lazyById();
    }
}
