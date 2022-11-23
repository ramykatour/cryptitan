<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Console\Command;

class ShowPassphrase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'show:passphrase';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Show wallet passphrases';

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
     * @return void
     */
    public function handle()
    {
        $admin = User::superAdmin()->firstOrFail();

        $this->warn('It is unsafe to expose your password.');

        if (!$this->confirm('Are you sure?')) {
            return $this->info('Password remains safe.');
        }

        if (!$admin->isTwoFactorEnabled()) {
            return $this->error('You need to enable 2FA.');
        }

        $input = $this->secret('Enter your Two Factor code');

        if ($admin->verifyTwoFactorToken($input)) {
            $this->table(['Name', 'Value'], Wallet::all()->map(fn(Wallet $wallet) => [
                "name"  => $wallet->coin->name,
                "value" => $wallet->passphrase
            ]));
        }
    }
}
