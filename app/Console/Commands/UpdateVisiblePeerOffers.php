<?php

namespace App\Console\Commands;

use App\Models\PeerOffer;
use App\Models\WalletAccount;
use Illuminate\Console\Command;
use Illuminate\Support\LazyCollection;

class UpdateVisiblePeerOffers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'peer-offers:update-visible';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Hides all sell offers that cannot be fulfilled.';

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
                    if ($account->getAvailableObject()->lessThan($offer->getMaxValueObject())) {
                        return tap($offer)->update(['display' => false]);
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
            ->where("display", true)->lazyById();
    }
}
