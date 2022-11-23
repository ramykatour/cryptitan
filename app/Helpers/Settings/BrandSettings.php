<?php

namespace App\Helpers\Settings;

use App\Helpers\InteractsWithStore;

class BrandSettings
{
    use InteractsWithStore;

    /**
     * Initialize attributes with default value
     *
     * @var array
     */
    protected array $attributes = [
        'logo_url'    => null,
        'favicon_url' => null,
        'support_url' => null,
        'terms_url'   => null,
        'policy_url'  => null,
    ];
}
