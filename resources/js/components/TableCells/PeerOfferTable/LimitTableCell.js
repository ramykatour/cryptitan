import React from "react";
import {Stack, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";

const LimitTableCell = ({offer}) => {
    return (
        <Stack>
            <Typography variant="caption">
                <FormattedMessage
                    defaultMessage="Max: {amount}"
                    values={{amount: offer.formatted_max_amount}}
                />
            </Typography>

            <Typography variant="caption">
                <FormattedMessage
                    defaultMessage="Min: {amount}"
                    values={{amount: offer.formatted_min_amount}}
                />
            </Typography>
        </Stack>
    );
};

export default LimitTableCell;
