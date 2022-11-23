<?php

namespace Database\Factories;

use App\Models\GiftcardContent;
use Illuminate\Database\Eloquent\Factories\Factory;

class GiftcardContentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'serial' => $this->faker->creditCardNumber(),
            'code'   => $this->faker->uuid(),
        ];
    }
}
