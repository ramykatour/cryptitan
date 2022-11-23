import React from "react";
import {Stack, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";

const PaymentTableCell = ({trade}) => {
    switch (trade.payment) {
        case "bank_account":
            return (
                <Typography variant="body2">
                    <FormattedMessage defaultMessage="Bank Transfer" />
                </Typography>
            );
        case "payment_method":
            return (
                <Stack sx={{minWidth: 0}}>
                    <Typography variant="body2" noWrap>
                        {trade.payment_method?.name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" noWrap>
                        {trade.payment_method?.category.name}
                    </Typography>
                </Stack>
            );
        default:
            return null;
    }
};

export default PaymentTableCell;
