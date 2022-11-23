import React from "react";
import {FormattedMessage} from "react-intl";
import {Stack, Typography} from "@mui/material";

const PaymentTableCell = ({offer}) => {
    switch (offer.payment) {
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
                        {offer.payment_method?.name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" noWrap>
                        {offer.payment_method?.category.name}
                    </Typography>
                </Stack>
            );
        default:
            return null;
    }
};

export default PaymentTableCell;
