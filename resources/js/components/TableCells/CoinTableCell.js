import React from "react";
import Coin from "models/Coin";
import {Box} from "@mui/material";
import IconBuilder from "components/IconBuilder";

const CoinTableCell = ({value}) => {
    const coin = Coin.use(value);
    return (
        <Box
            component={IconBuilder}
            sx={{fontSize: 30}}
            icon={coin.svgIcon()}
        />
    );
};

export default CoinTableCell;
