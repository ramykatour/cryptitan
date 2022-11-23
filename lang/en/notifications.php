<?php

return [
    'verify_email' => [
        'title' => 'Verify Email',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'Verify Email Address',
            'content'  => 'Please click the button below to verify your email address.',
            'action'   => 'Verify',
        ],
    ],

    'phone_token' => [
        'title' => 'Phone Token',

        'sms' => [
            'content' => ':code is your verification code, it expires in :minutes minutes.',
        ],
    ],

    'email_token' => [
        'title' => 'Email Token',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'OTP Request',
            'content'  => '<b>:code</b> is your verification code, it expires in <b>:minutes</b> minutes.',
        ],
    ],

    'payment_debit' => [
        'title' => 'Sent payment',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'DEBIT: Your :currency account was debited with -:formatted_value',
            'content'  => 'Your <b>:currency</b> account was debited with <b>-:formatted_value</b>',
        ],

        'sms' => [
            'content' => 'Your :currency account was debited with -:formatted_value',
        ],

        'database' => [
            'content' => 'Your :currency account was debited with -:formatted_value',
        ],
    ],

    'payment_credit' => [
        'title' => 'Received payment',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'CREDIT: Your :currency account was credited with :formatted_value',
            'content'  => 'Your <b>:currency</b> account was credited with <b>:formatted_value</b>',
        ],

        'sms' => [
            'content' => 'Your :currency account was credited with :formatted_value',
        ],

        'database' => [
            'content' => 'Your :currency account was credited with :formatted_value',
        ],
    ],

    'giftcard_purchase' => [
        'title' => 'Giftcard purchase',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'Thank you for your purchase!',
            'content'  => 'We are happy to inform you that your <b>:items_count</b> giftcard purchases of <b>:total</b> in total is now available in your account.',
        ],

        'sms' => [
            'content' => 'Your :items_count giftcard purchases of :total is now available in your account.',
        ],

        'database' => [
            'content' => 'Your :items_count giftcard purchases of :total is now available in your account.',
        ],
    ],

    'user_activity' => [
        'title' => 'Account changes',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'Change detected in your account',
            'content'  => 'We detected the activity: <b>:action</b> on your account <br/> <br/> IP address: <b>:ip</b>  <br/> Browser: <b>:agent</b> <br/> Country: <b>:country</b>  <br/> <br/> If this was not you, please contact our help center as soon as possible.',
        ],

        'sms' => [
            'content' => 'We detected the following activity on your account: :action',
        ],

        'database' => [
            'content' => 'We detected the following activity on your account: :action',
        ],
    ],

    'wallet_debit' => [
        'title' => 'Sent crypto',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'DEBIT: Your :coin account was debited with -:value',
            'content'  => 'Your <b>:coin</b> account was debited with <b>-:value</b> (-:formatted_value_price)',
        ],

        'sms' => [
            'content' => 'Your :coin account was debited with -:value (-:formatted_value_price)',
        ],

        'database' => [
            'content' => 'Your :coin account was debited with -:value (-:formatted_value_price)',
        ],
    ],

    'wallet_credit' => [
        'title' => 'Received crypto',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'CREDIT: Your :coin account was credited with :value',
            'content'  => 'Your <b>:coin</b> account was credited with <b>:value</b> (:formatted_value_price)',
        ],

        'sms' => [
            'content' => 'Your :coin account was credited with :value (:formatted_value_price)',
        ],

        'database' => [
            'content' => 'Your :coin account was credited with :value (:formatted_value_price)',
        ],
    ],

    'peer_trade_started'   => [
        'title' => 'Started trade',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'P2P Trade Started (:id)',
            'content'  => 'A new <b>:coin</b> P2P trade of <b>:formatted_amount</b> (:value) has started.',
        ],

        'sms' => [
            'content' => 'A new :coin P2P trade of :formatted_amount (:value) has started.',
        ],

        'database' => [
            'content' => 'A new :coin P2P trade of :formatted_amount (:value) has started.',
        ],
    ],

    'peer_trade_canceled'  => [
        'title' => 'Canceled trade',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'P2P Trade Canceled (:id)',
            'content'  => 'The P2P trade with the ID: <b>:id</b> was canceled.',
        ],

        'sms' => [
            'content' => 'The P2P trade with the ID: :id was canceled.',
        ],

        'database' => [
            'content' => 'The P2P trade with the ID: :id was canceled.',
        ],
    ],

    'peer_trade_confirmed' => [
        'title' => 'Marked trade as paid',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'P2P Trade Marked as Paid (:id)',
            'content'  => 'The P2P trade with the ID: <b>:id</b> was marked as paid.',
        ],

        'sms' => [
            'content' => 'The P2P trade with the ID: :id was marked as paid.',
        ],

        'database' => [
            'content' => 'The P2P trade with the ID: :id was marked as paid.',
        ],
    ],

    'peer_trade_completed' => [
        'title' => 'Completed trade',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'P2P Trade Completed (:id)',
            'content'  => 'The P2P trade with the ID: <b>:id</b> was completed.',
        ],

        'sms' => [
            'content' => 'The P2P trade with the ID: :id was completed.',
        ],

        'database' => [
            'content' => 'The P2P trade with the ID: :id was completed.',
        ],
    ],

    'peer_trade_disputed'  => [
        'title' => 'Disputed trade',

        'mail' => [
            'greeting' => 'Hi, :username',
            'subject'  => 'P2P Trade Disputed (:id)',
            'content'  => 'The P2P trade with the ID: <b>:id</b> was disputed.',
        ],

        'sms' => [
            'content' => 'The P2P trade with the ID: :id was disputed.',
        ],

        'database' => [
            'content' => 'The P2P trade with the ID: :id was disputed.',
        ],
    ],
];
