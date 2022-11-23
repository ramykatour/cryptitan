<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Relations\MorphMany;

interface Rateable
{
    /**
     * Ratings relation
     *
     * @return MorphMany
     */
    public function ratings(): MorphMany;
}