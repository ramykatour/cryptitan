import React from "react";
import {defineMessages, useIntl} from "react-intl";
import {Stack, Typography} from "@mui/material";

const messages = defineMessages({
    fee: {defaultMessage: "Fee"}
});

const FeeEstimate = ({feeEstimate}) => {
    const intl = useIntl();

    if (!feeEstimate) {
        return null;
    }

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Typography variant="caption">
                {intl.formatMessage(messages.fee)}
            </Typography>

            <Stack
                direction="row"
                divider={<span>&#8776;</span>}
                justifyContent="flex-end"
                spacing={1}>
                <Typography variant="caption">{feeEstimate.value}</Typography>
                <Typography variant="caption">{feeEstimate.price}</Typography>
            </Stack>
        </Stack>
    );
};

export default FeeEstimate;
