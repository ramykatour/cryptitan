import React, {useMemo} from "react";
import {FormattedMessage} from "react-intl";
import {Stack, Typography} from "@mui/material";

const PaymentTableCell = ({trade}) => {
    const isNegative = trade.type === "buy";

    const statusMessage = useMemo(() => {
        switch (trade.status) {
            case "canceled":
                return <FormattedMessage defaultMessage="Canceled" />;
            case "pending":
                return <FormattedMessage defaultMessage="Pending" />;
            case "completed":
                return <FormattedMessage defaultMessage="Completed" />;
        }
    }, [trade]);

    return (
        <Stack sx={{width: "100%"}}>
            <Typography sx={{whiteSpace: "nowrap"}} variant="body2">
                {isNegative && "-"}
                {trade.formatted_payment_value}
            </Typography>

            <Typography
                color="text.secondary"
                sx={{whiteSpace: "nowrap"}}
                variant="caption">
                {statusMessage}
            </Typography>
        </Stack>
    );
};

export default PaymentTableCell;
