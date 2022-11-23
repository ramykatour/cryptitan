<?php

namespace App\CoinAdapters\Contracts;

interface MarketApi
{
    /**
     * Market identifier
     *
     * @return string
     */
    public function marketId(): string;
}
