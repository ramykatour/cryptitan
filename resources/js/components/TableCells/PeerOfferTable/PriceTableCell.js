import React from "react";
import {Typography} from "@mui/material";

const PriceTableCell = ({offer}) => {
    return <Typography variant="body2">{offer.formatted_price}</Typography>;
};

export default PriceTableCell;
