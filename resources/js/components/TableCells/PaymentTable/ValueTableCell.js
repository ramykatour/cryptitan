import React, {useMemo} from "react";
import {FormattedMessage} from "react-intl";
import {Stack, Typography} from "@mui/material";

const ValueTableCell = ({transaction}) => {
    const negative = transaction.type === "send";

    const statusMessage = useMemo(() => {
        switch (transaction.status) {
            case "canceled":
                return <FormattedMessage defaultMessage="Canceled" />;
            case "pending-gateway":
            case "pending-transfer":
                return <FormattedMessage defaultMessage="Pending" />;
            case "completed":
                return <FormattedMessage defaultMessage="Completed" />;
        }
    }, [transaction]);

    return (
        <Stack alignItems="flex-end">
            <Typography sx={{whiteSpace: "nowrap"}} variant="body2">
                {negative && "-"}
                {transaction.formatted_value}
            </Typography>

            <Typography color="text.secondary" variant="caption">
                {statusMessage}
            </Typography>
        </Stack>
    );
};

export default ValueTableCell;
