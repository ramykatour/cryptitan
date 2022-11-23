<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    /**
     * Available modules
     *
     * @var array
     */
    protected array $data = [
        'exchange' => 'Exchange',
        'peer'     => 'P2P',
        'giftcard' => 'Giftcard',
        'wallet'   => 'Wallet',
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->data as $name => $title) {
            Module::updateOrCreate(compact('name'), compact('title'));
        }
    }
}
