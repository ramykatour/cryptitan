import React, {useMemo} from "react";
import PageTabs from "components/PageTabs";
import {defineMessages, useIntl} from "react-intl";
import exchange from "@iconify-icons/ri/exchange-fill";
import Trades from "./components/Trades";
import handCoin from "@iconify-icons/ri/hand-coin-fill";
import Payments from "./components/Payments";

const messages = defineMessages({
    trades: {defaultMessage: "Trades"},
    payments: {defaultMessage: "Payments"},
    title: {defaultMessage: "P2P"}
});

const Peer = () => {
    const intl = useIntl();

    const tabs = useMemo(() => {
        return [
            {
                value: "trades",
                label: intl.formatMessage(messages.trades),
                icon: exchange,
                component: <Trades />
            },
            {
                value: "payments",
                label: intl.formatMessage(messages.payments),
                icon: handCoin,
                component: <Payments />
            }
        ];
    }, [intl]);

    return (
        <PageTabs
            initial="trades"
            title={intl.formatMessage(messages.title)}
            tabs={tabs}
        />
    );
};

export default Peer;
