import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import {Card} from "@mui/material";
import Deposit from "./components/Deposit";
import Withdraw from "./components/Withdraw";
import CardTabs from "components/CardTabs";

const messages = defineMessages({
    withdraw: {defaultMessage: "Withdraw"},
    deposit: {defaultMessage: "Deposit"}
});

const Action = () => {
    const intl = useIntl();

    const tabs = useMemo(
        () => [
            {
                label: intl.formatMessage(messages.withdraw),
                component: <Withdraw />
            },
            {
                label: intl.formatMessage(messages.deposit),
                component: <Deposit />
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
