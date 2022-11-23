import React from "react";
import {CardHeader} from "@mui/material";
import {FormattedMessage} from "react-intl";
import PeerTradesTable from "components/PeerTradesTable";
import ResponsiveCard from "components/ResponsiveWidgets/responsiveCard";
import TrapScrollBox from "components/TrapScrollBox";

const ActivePeerTradeSell = () => {
    return (
        <ResponsiveCard>
            <CardHeader
                title={<FormattedMessage defaultMessage="Active Sell Trades" />}
            />

            <TrapScrollBox sx={{flexGrow: 1}}>
                <PeerTradesTable type="sell" status="active" />
            </TrapScrollBox>
        </ResponsiveCard>
    );
};

ActivePeerTradeSell.dimensions = {
    lg: {w: 6, h: 3, isResizable: false},
    md: {w: 4, h: 3, isResizable: false},
    sm: {w: 2, h: 3, isResizable: false},
    xs: {w: 1, h: 3, isResizable: false}
};

export default ActivePeerTradeSell;
