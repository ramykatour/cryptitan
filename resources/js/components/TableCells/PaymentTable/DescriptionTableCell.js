import React from "react";
import {Stack} from "@mui/material";
import Copyable from "components/Copyable";

const DescriptionTableCell = ({transaction}) => {
    return (
        <Stack sx={{minWidth: 0}}>
            <Copyable variant="body2" ellipsis>
                {transaction.description}
            </Copyable>
        </Stack>
    );
};

export default DescriptionTableCell;
