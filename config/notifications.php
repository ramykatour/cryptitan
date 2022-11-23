<?php

use NotificationChannels\AfricasTalking\AfricasTalkingChannel;
use NotificationChannels\AwsSns\SnsChannel;
use NotificationChannels\Twilio\TwilioChannel;

return [
    'defaults' => [
        'sms' => env('SMS_PROVIDER', 'vonage'),
    ],

    'drivers' => [
        'sms' => [
            'vonage' => ['channel' => 'vonage'],

            'twilio' => ['channel' => TwilioChannel::class],

            'africastalking' => ['channel' => AfricasTalkingChannel::class],

            'sns' => ['channel' => SnsChannel::class],
        ],
    ],

    'settings' => [
        'payment_debit' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],

        'payment_credit' => [
            'email'    => true,
            'database' => true,
            'sms'      => true,
        ],

        'wallet_debit' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],

        'wallet_credit' => [
            'email'    => true,
            'database' => true,
            'sms'      => true,
        ],

        'giftcard_purchase' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],

        'user_activity' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],

        'peer_trade_started' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],

        'peer_trade_canceled' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],

        'peer_trade_confirmed' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],

        'peer_trade_completed' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],

        'peer_trade_disputed' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],
    ],
];
