import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import PageTabs from "components/PageTabs";
import arrowUp from "@iconify/icons-ic/baseline-arrow-circle-up";
import arrowDown from "@iconify/icons-ic/baseline-arrow-circle-down";
import Content from "./components/Content";

const messages = defineMessages({
    title: {defaultMessage: "My Trades"},
    buy: {defaultMessage: "Buy"},
    sell: {defaultMessage: "Sell"}
});

const Trades = () => {
    const intl = useIntl();

    const tabs = useMemo(
        () => [
            {
                value: "buy",
                label: intl.formatMessage(messages.buy),
                icon: arrowDown,
                component: <Content type="buy" />
            },
            {
                value: "sell",
                label: intl.formatMessage(messages.sell),
                icon: arrowUp,
                component: <Content type="sell" />
            }
        ],
        [intl]
    );

    return (
        <PageTabs
            initial="buy"
            title={intl.formatMessage(messages.title)}
            tabs={tabs}
        />
    );
};

export default Trades;
