import React from "react";
import {Card, CardContent, CardHeader, Stack} from "@mui/material";
import {FormattedMessage} from "react-intl";
import Type from "../../../components/Type";
import Account from "../../../components/Account";
import PriceType from "../../../components/PriceType";
import Country from "../../../components/Country";
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
                    <Country />
                    <Price />
                </Stack>
            </CardContent>
        </Card>
    );
};

export default Summary;
