import React from "react";
import {Card, CardContent, CardHeader, Stack} from "@mui/material";
import {FormattedMessage} from "react-intl";
import Type from "../../../components/Type";
import Account from "../../../components/Account";
import PriceType from "../../../components/PriceType";
import Payment from "../../../components/Payment";
import TimeLimit from "../../../components/TimeLimit";
import MinAmount from "../../../components/MinAmount";
import MaxAmount from "../../../components/MaxAmount";
import Price from "../../../components/Price";

const Summary = () => {
    return (
        <Card>
            <CardHeader title={<FormattedMessage defaultMessage="Summary" />} />

            <CardContent>
                <Stack spacing={2}>
                    <Type />
                    <Account />
                    <PriceType />
                    <Payment />
                    <TimeLimit />
                    <MinAmount />
                    <MaxAmount />
                    <Price />
                </Stack>
            </CardContent>
        </Card>
    );
};

export default Summary;
