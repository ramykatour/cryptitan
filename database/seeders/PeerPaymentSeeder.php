<?php

namespace Database\Seeders;

use App\Models\PeerPaymentCategory;
use App\Models\PeerPaymentMethod;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Seeder;

class PeerPaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (app()->environment('local')) {
            PeerPaymentCategory::factory()
                ->has($this->methodFactory(), 'methods')
                ->count(3)->create();
        }
    }

    /**
     * PeerPaymentMethods
     *
     * @return Factory
     */
    protected function methodFactory(): Factory
    {
        return PeerPaymentMethod::factory()->count(200);
    }
}
