<?php

namespace App\CoinAdapters;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

trait TokenPrice
{
    /**
     * Blockchain Ids
     *
     * @var int[]
     */
    protected $blockchains = [
        'ethereum'            => 'eth',
        'binance-smart-chain' => 'bsc',
    ];

    /**
     * Initialize TokenPrice api
     *
     * @return PendingRequest
     */
    protected function tokenPriceApi()
    {
        return Http::baseUrl('https://deep-index.moralis.io/api/v2/')->acceptJson()
            ->withHeaders(["X-API-Key" => config('services.moralis.key')]);
    }

    /**
     * Initialize CoinPrice api
     *
     * @return PendingRequest
     */
    protected function coinPriceApi()
    {
        $client = Http::baseUrl('https://api.coincap.io/v2/')->acceptJson();

        return tap($client, function ($client) {
            if ($token = config('services.coincap.key')) {
                $client->withToken($token);
            }
        });
    }

    /**
     * @inheritdoc
     * @throws RequestException
     */
    public function getDollarPrice(): float
    {
        return (float) $this->tokenPriceApi()->get("erc20/{$this->getContract()}/price", [
            "chain" => data_get($this->blockchains, $this->chainId())
        ])->json('usdPrice', function () {
            return $this->config('dollar_price') ?: 0;
        });
    }

    /**
     * @inheritdoc
     */
    public function marketChart(string $interval): array
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public function getDollarPriceChange(): float
    {
        return 0;
    }

    /**
     * Get network price
     *
     * @return float
     * @throws RequestException
     */
    protected function getNetworkDollarPrice(): float
    {
        return (float) $this->coinPriceApi()->get("assets/{$this->marketId()}")
            ->throw()->collect('data')->get('priceUsd');
    }
}
