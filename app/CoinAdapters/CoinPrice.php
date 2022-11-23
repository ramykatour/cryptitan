<?php

namespace App\CoinAdapters;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

trait CoinPrice
{
    /**
     * Market chart interval
     *
     * @var int[]
     */
    protected $chartIntervals = [
        'hour'  => 'm1',
        'day'   => 'm15',
        'week'  => 'h2',
        'month' => 'h6',
        'year'  => 'd1',
    ];

    /**
     * Initialize Http client
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
        return (float) $this->coinPriceApi()->get("assets/{$this->marketId()}")
            ->throw()->collect('data')->get('priceUsd');
    }

    /**
     * @inheritdoc
     * @throws RequestException
     */
    public function marketChart(string $interval): array
    {
        $data = $this->coinPriceApi()->get("assets/{$this->marketId()}/history", [
            'start'    => now()->sub($interval, 1)->getPreciseTimestamp(3),
            'end'      => now()->getPreciseTimestamp(3),
            'interval' => data_get($this->chartIntervals, $interval, 'd1'),
        ])->throw()->collect('data');

        return $data->map(function ($content) {
            return [$content['time'], $content['priceUsd']];
        })->toArray();
    }

    /**
     * @inheritdoc
     * @throws RequestException
     */
    public function getDollarPriceChange(): float
    {
        return (float) $this->coinPriceApi()->get("assets/{$this->marketId()}")
            ->throw()->collect('data')->get('changePercent24Hr');
    }
}
