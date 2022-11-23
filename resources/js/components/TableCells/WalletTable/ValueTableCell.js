import React from "react";
import {Stack, Tooltip, Typography} from "@mui/material";

const ValueTableCell = ({transaction}) => {
    const negative = transaction.type === "send";

    return (
        <Tooltip title={transaction.value}>
            <Stack alignItems="flex-end" sx={{width: "100%"}}>
                <Typography sx={{whiteSpace: "nowrap"}} variant="body2">
                    {negative && "-"}
                    {transaction.value}
                </Typography>

                <Typography
                    sx={{color: "text.secondary", whiteSpace: "nowrap"}}
                    variant="caption">
                    {negative && "-"}
                    {transaction.formatted_value_price}
                </Typography>
            </Stack>
        </Tooltip>
    );
};

export default ValueTableCell;
