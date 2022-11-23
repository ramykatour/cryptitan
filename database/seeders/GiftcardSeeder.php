<?php

namespace Database\Seeders;

use App\Models\Giftcard;
use App\Models\GiftcardBrand;
use App\Models\GiftcardContent;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Seeder;

class GiftcardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (app()->environment('local')) {
            GiftcardBrand::factory()
                ->has($this->giftcardsFactory(), 'giftcards')
                ->count(2)->create();
        }
    }

    /**
     * Giftcard
     *
     * @return Factory
     */
    protected function giftcardsFactory(): Factory
    {
        return Giftcard::factory()
            ->has($this->contentsFactory(), 'contents')
            ->count(200);
    }

    /**
     * GiftcardContent
     *
     * @return Factory
     */
    protected function contentsFactory(): Factory
    {
        return GiftcardContent::factory()->count(5);
    }
}
