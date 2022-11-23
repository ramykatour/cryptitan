<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\PeerPaymentCategory;

/**
 * @extends Factory<PeerPaymentCategory>
 */
class PeerPaymentCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name'        => $this->faker->company(),
            'description' => $this->faker->paragraph()
        ];
    }
}
