import React from "react";
import ResponsiveCard from "components/ResponsiveWidgets/responsiveCard";
import {FormattedMessage} from "react-intl";
import {CardHeader} from "@mui/material";
import PeerTradesTable from "components/PeerTradesTable";
import TrapScrollBox from "components/TrapScrollBox";

const ActivePeerTradeBuy = () => {
    return (
        <ResponsiveCard>
            <CardHeader
                title={<FormattedMessage defaultMessage="Active Buy Trades" />}
            />

            <TrapScrollBox sx={{flexGrow: 1}}>
                <PeerTradesTable type="buy" status="active" />
            </TrapScrollBox>
        </ResponsiveCard>
    );
};

ActivePeerTradeBuy.dimensions = {
    lg: {w: 6, h: 3, isResizable: false},
    md: {w: 4, h: 3, isResizable: false},
    sm: {w: 2, h: 3, isResizable: false},
    xs: {w: 1, h: 3, isResizable: false}
};

export default ActivePeerTradeBuy;
