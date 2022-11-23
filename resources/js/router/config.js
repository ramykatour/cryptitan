import React from "react";
import lockPassword from "@iconify-icons/ri/lock-password-line";
import {FormattedMessage} from "react-intl";
import loginCircle from "@iconify-icons/ri/login-circle-line";
import lockUnlock from "@iconify-icons/ri/lock-unlock-line";
import userAdd from "@iconify-icons/ri/user-add-line";
import global from "@iconify-icons/ri/global-fill";
import home from "@iconify-icons/ri/home-7-fill";
import user from "@iconify-icons/ri/user-fill";
import shoppingBag from "@iconify-icons/ri/shopping-bag-2-line";
import profile from "@iconify-icons/ri/profile-fill";
import settings from "@iconify-icons/ri/settings-fill";
import questionnaire from "@iconify-icons/ri/questionnaire-line";
import exchangeFunds from "@iconify-icons/ri/exchange-funds-fill";
import exchange from "@iconify-icons/ri/exchange-fill";
import swapBox from "@iconify-icons/ri/hand-coin-fill";
import fileList from "@iconify-icons/ri/file-list-2-fill";
import createDraft from "@iconify-icons/ri/draft-fill";
import exchangeDollar from "@iconify-icons/ri/exchange-dollar-fill";
import swap from "@iconify-icons/ri/swap-line";
import gift from "@iconify-icons/ri/gift-2-fill";
import shoppingBasket from "@iconify-icons/ri/shopping-basket-2-line";
import bank from "@iconify-icons/ri/bank-fill";
import wallet3 from "@iconify-icons/ri/wallet-3-fill";
import passport from "@iconify-icons/ri/passport-line";
import controlPanel from "@iconify-icons/ri/cpu-line";
import group from "@iconify-icons/ri/group-fill";
import store from "@iconify-icons/ri/store-2-fill";
import shieldStar from "@iconify-icons/ri/shield-star-fill";
import settings4 from "@iconify-icons/ri/settings-4-fill";
import stack from "@iconify-icons/ri/stack-fill";
import translate from "@iconify-icons/ri/translate-2";
import paintBrush from "@iconify-icons/ri/paint-brush-fill";
import plug from "@iconify-icons/ri/plug-fill";

const config = [
    {
        key: "auth",
        icon: lockPassword,
        path: "auth/*",
        name: <FormattedMessage defaultMessage="Auth" />,
        children: [
            {
                key: "login",
                icon: loginCircle,
                path: "login",
                name: <FormattedMessage defaultMessage="Login" />
            },
            {
                key: "forgot-password",
                icon: lockUnlock,
                path: "forgot-password",
                name: <FormattedMessage defaultMessage="Forgot Password" />
            },
            {
                key: "register",
                icon: userAdd,
                path: "register",
                name: <FormattedMessage defaultMessage="Register" />
            }
        ]
    },
    {
        key: "main",
        icon: global,
        path: "*",
        name: <FormattedMessage defaultMessage="Main" />,
        children: [
            {
                key: "home",
                icon: home,
                path: "home",
                name: <FormattedMessage defaultMessage="Home" />
            },
            {
                key: "user",
                icon: user,
                path: "user/*",
                name: <FormattedMessage defaultMessage="User" />,
                children: [
                    {
                        key: "account",
                        icon: user,
                        path: "account",
                        name: <FormattedMessage defaultMessage="Account" />
                    },
                    {
                        key: "purchases",
                        icon: shoppingBag,
                        path: "purchases",
                        name: <FormattedMessage defaultMessage="Purchases" />
                    }
                ]
            },
            {
                key: "profile",
                icon: user,
                path: "profile/:name",
                name: <FormattedMessage defaultMessage="Profile" />
            },
            {
                key: "user-setup",
                icon: profile,
                path: "user-setup",
                name: <FormattedMessage defaultMessage="User Setup" />
            },
            {
                key: "settings",
                icon: settings,
                path: "settings",
                name: <FormattedMessage defaultMessage="Settings" />
            },
            {
                key: "help",
                icon: questionnaire,
                path: "help",
                name: <FormattedMessage defaultMessage="Help" />
            },
            {
                key: "wallets",
                icon: wallet3,
                path: "wallets",
                name: <FormattedMessage defaultMessage="Wallets" />
            },
            {
                key: "exchange",
                icon: exchangeFunds,
                path: "exchange/*",
                name: <FormattedMessage defaultMessage="Exchange" />,
                children: [
                    {
                        key: "trade",
                        icon: exchangeDollar,
                        path: "trade",
                        name: <FormattedMessage defaultMessage="Trade" />
                    },
                    {
                        key: "swap",
                        icon: swap,
                        path: "swap",
                        name: <FormattedMessage defaultMessage="Swap" />
                    }
                ]
            },
            {
                key: "peer",
                icon: swapBox,
                path: "peer/*",
                name: <FormattedMessage defaultMessage="P2P" />,
                children: [
                    {
                        key: "buy-crypto",
                        icon: fileList,
                        path: "buy-crypto",
                        name: <FormattedMessage defaultMessage="Buy Crypto" />
                    },
                    {
                        key: "sell-crypto",
                        icon: fileList,
                        path: "sell-crypto",
                        name: <FormattedMessage defaultMessage="Sell Crypto" />
                    },
                    {
                        key: "trades",
                        icon: swapBox,
                        path: "trades",
                        name: <FormattedMessage defaultMessage="My Trades" />
                    },
                    {
                        key: "create-offer",
                        icon: createDraft,
                        path: "create-offer",
                        name: <FormattedMessage defaultMessage="Create Offer" />
                    },
                    {
                        key: "offer",
                        icon: fileList,
                        path: "offer/:id",
                        name: <FormattedMessage defaultMessage="Offer" />
                    },
                    {
                        key: "trade",
                        icon: exchange,
                        path: "trade/:id",
                        name: <FormattedMessage defaultMessage="Trade" />
                    }
                ]
            },
            {
                key: "giftcards",
                icon: gift,
                path: "giftcards/*",
                name: <FormattedMessage defaultMessage="Giftcards" />,
                children: [
                    {
                        key: "shop",
                        icon: shoppingBag,
                        path: "shop",
                        name: <FormattedMessage defaultMessage="Shop" />
                    },
                    {
                        key: "checkout",
                        icon: shoppingBasket,
                        path: "checkout",
                        name: <FormattedMessage defaultMessage="Checkout" />
                    }
                ]
            },
            {
                key: "payments",
                icon: bank,
                path: "payments",
                name: <FormattedMessage defaultMessage="Payments" />
            },
            {
                key: "limits",
                icon: passport,
                path: "limits",
                name: <FormattedMessage defaultMessage="Limits" />
            }
        ]
    },
    {
        key: "admin",
        icon: controlPanel,
        path: "admin/*",
        name: <FormattedMessage defaultMessage="Admin" />,
        children: [
            {
                key: "home",
                icon: home,
                path: "home",
                name: <FormattedMessage defaultMessage="Dashboard" />
            },
            {
                key: "wallets",
                icon: wallet3,
                path: "wallets",
                name: <FormattedMessage defaultMessage="Wallets" />
            },
            {
                key: "users",
                icon: group,
                path: "users",
                name: <FormattedMessage defaultMessage="Users" />
            },
            {
                key: "marketplace",
                icon: store,
                path: "marketplace",
                name: <FormattedMessage defaultMessage="Marketplace" />
            },
            {
                key: "peer",
                icon: swapBox,
                path: "peer",
                name: <FormattedMessage defaultMessage="P2P" />
            },
            {
                key: "verification",
                icon: shieldStar,
                path: "verification",
                name: <FormattedMessage defaultMessage="Verification" />
            },
            {
                key: "payments",
                icon: bank,
                path: "payments",
                name: <FormattedMessage defaultMessage="Payments" />
            },
            {
                key: "exchange",
                icon: exchangeFunds,
                path: "exchange",
                name: <FormattedMessage defaultMessage="Exchange" />
            },
            {
                key: "giftcards",
                icon: gift,
                path: "giftcards",
                name: <FormattedMessage defaultMessage="Giftcards" />
            },
            {
                key: "settings",
                icon: settings4,
                path: "settings",
                name: <FormattedMessage defaultMessage="Settings" />
            },
            {
                key: "modules",
                icon: stack,
                path: "modules",
                name: <FormattedMessage defaultMessage="Modules" />
            },
            {
                key: "localization",
                icon: translate,
                path: "localization",
                name: <FormattedMessage defaultMessage="Localization" />
            },
            {
                key: "customize",
                icon: paintBrush,
                path: "customize",
                name: <FormattedMessage defaultMessage="Customize" />
            },
            {
                key: "developer",
                icon: plug,
                path: "developer",
                name: <FormattedMessage defaultMessage="Developer" />
            }
        ]
    }
];

export default config;
