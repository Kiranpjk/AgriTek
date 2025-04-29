<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class FarmerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber,
            'land_size' => $this->faker->numberBetween(1, 50),
            'crop_type' => $this->faker->randomElement(['Wheat', 'Rice', 'Corn']),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
