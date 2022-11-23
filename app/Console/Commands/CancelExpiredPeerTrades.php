<?php

namespace App\Console\Commands;

use App\Models\PeerTrade;
use Illuminate\Console\Command;
use Illuminate\Support\LazyCollection;

class CancelExpiredPeerTrades extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'peer-trades:cancel-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancel expired peer trades';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $this->getPeerTrades()->each(function ($trade) {
            $trade->acquireLock(function (PeerTrade $trade) {
                if ($trade->shouldAutoCancel()) {
                    $trade->cancel();
                }
            });
        });
    }

    /**
     * Get PeerTrade in progress
     *
     * @return LazyCollection
     */
    protected function getPeerTrades()
    {
        return PeerTrade::inProgress()
            ->whereNull('confirmed_at')
            ->lazyById();
    }
}
