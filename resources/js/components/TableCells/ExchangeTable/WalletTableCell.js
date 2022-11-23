import React from "react";
import {Stack, Tooltip, Typography} from "@mui/material";

const WalletTableCell = ({trade}) => {
    const negative = trade.type === "sell";

    return (
        <Tooltip title={trade.wallet_value}>
            <Stack sx={{width: "100%"}}>
                <Typography sx={{whiteSpace: "nowrap"}} variant="body2">
                    {negative && "-"}
                    {trade.wallet_value}
                </Typography>

                <Typography
                    sx={{color: "text.secondary", whiteSpace: "nowrap"}}
                    variant="caption">
                    {negative && "-"}
                    {trade.formatted_wallet_value_price}
                </Typography>
            </Stack>
        </Tooltip>
    );
};

export default WalletTableCell;
