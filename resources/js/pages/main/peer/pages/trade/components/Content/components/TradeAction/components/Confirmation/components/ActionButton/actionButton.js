import React, {useContext} from "react";
import {Alert, Box, CardActions} from "@mui/material";
import PeerTradeContext from "contexts/PeerTradeContext";
import Confirm from "./components/Confirm";
import Cancel from "./components/Cancel";
import Dispute from "./components/Dispute";
import Release from "./components/Release";
import {FormattedMessage} from "react-intl";

const ActionButton = () => {
    const {trade} = useContext(PeerTradeContext);

    switch (trade.role) {
        case "buyer":
            return <BuyerAction />;
        case "seller":
            return <SellerAction />;
        default:
            return <AdminAction />;
    }
};

const BuyerAction = () => {
    const {trade} = useContext(PeerTradeContext);

    if (!trade.isActive()) {
        return null;
    }

    return (
        <CardActions sx={{px: 2}}>
            <Cancel />
            {!trade.confirmed ? <Confirm /> : <Dispute />}
        </CardActions>
    );
};

const SellerAction = () => {
    const {trade} = useContext(PeerTradeContext);

    if (!trade.isActive()) {
        return null;
    }

    return !trade.confirmed ? (
        <Box sx={{px: 2}}>
            <Alert severity="info" icon={false}>
                <FormattedMessage defaultMessage="Waiting for buyer's payment." />
            </Alert>
        </Box>
    ) : (
        <CardActions sx={{px: 2}}>
            <Dispute />
            <Release />
        </CardActions>
    );
};

const AdminAction = () => {
    const {trade} = useContext(PeerTradeContext);

    if (!trade.isDisputed()) {
        return null;
    }

    return (
        <CardActions sx={{px: 2}}>
            <Cancel />
            <Release />
        </CardActions>
    );
};

export default ActionButton;
