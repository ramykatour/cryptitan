import React from "react";
import {isString} from "lodash";
import {Stack, Typography} from "@mui/material";
import {formatDate, formatDateFromNow} from "utils/formatter";

const DateTableCell = ({value}) => {
    if (!isString(value)) {
        return null;
    }

    return (
        <Stack spacing={0.3} sx={{minWidth: 0}}>
            <Typography variant="body2">{formatDateFromNow(value)}</Typography>

            <Typography variant="caption" sx={{color: "text.secondary"}}>
                {formatDate(value, "lll")}
            </Typography>
        </Stack>
    );
};

export default DateTableCell;
