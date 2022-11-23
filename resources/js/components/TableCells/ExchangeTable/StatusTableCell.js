import React from "react";
import Coin from "models/Coin";
import IconBuilder from "components/IconBuilder";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {getSymbolIcon} from "utils/helpers";
import {Stack} from "@mui/material";

const StatusTableCell = ({trade}) => {
    const coin = Coin.use(trade.coin);

    const walletIcon = (
        <IconBuilder sx={{fontSize: "25px"}} icon={coin.svgIcon()} />
    );

    const arrowIcon = (
        <ArrowForwardIcon
            color={trade.status === "completed" ? "success" : "disabled"}
            fontSize="small"
        />
    );

    const paymentIcon = getSymbolIcon(trade.payment_symbol);

    switch (trade.type) {
        case "buy":
            return (
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}>
                    {paymentIcon}
                    {arrowIcon}
                    {walletIcon}
                </Stack>
            );

        case "sell":
            return (
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}>
                    {walletIcon}
                    {arrowIcon}
                    {paymentIcon}
                </Stack>
            );
    }
};

export default StatusTableCell;
