import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import Buy from "./components/Buy";
import Sell from "./components/Sell";
import {Card} from "@mui/material";
import CardTabs from "components/CardTabs";

const messages = defineMessages({
    buy: {defaultMessage: "Buy"},
    sell: {defaultMessage: "Sell"}
});

const Action = () => {
    const intl = useIntl();

    const tabs = useMemo(
        () => [
            {
                label: intl.formatMessage(messages.buy),
                component: <Buy />
            },
            {
                label: intl.formatMessage(messages.sell),
                component: <Sell />
            }
        ],
        [intl]
    );

    return (
        <Card>
            <CardTabs tabs={tabs} />
        </Card>
    );
};

export default Action;
