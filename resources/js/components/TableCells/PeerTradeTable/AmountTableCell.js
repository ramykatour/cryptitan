import React from "react";
import {Stack, Typography} from "@mui/material";

const AmountTableCell = ({trade}) => {
    return (
        <Stack>
            <Typography variant="body2">
                {`${trade.value} ${trade.coin.symbol} `}
            </Typography>

            <Typography variant="caption" color="text.secondary">
                {trade.formatted_amount}
            </Typography>
        </Stack>
    );
};

export default AmountTableCell;
