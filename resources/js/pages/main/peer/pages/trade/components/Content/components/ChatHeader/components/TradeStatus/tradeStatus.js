import React, {useContext} from "react";
import Countdown from "react-countdown";
import {Chip, Typography} from "@mui/material";
import PeerTradeContext from "contexts/PeerTradeContext";
import {parseDate} from "utils/form";
import {FormattedMessage} from "react-intl";
import Label from "components/Label";

const TradeStatus = () => {
    const {trade} = useContext(PeerTradeContext);

    switch (trade.status) {
        case "completed":
            return (
                <Label variant="ghost" color="success">
                    <FormattedMessage defaultMessage="Completed" />
                </Label>
            );
        case "disputed":
            return (
                <Label variant="ghost" color="warning">
                    <FormattedMessage defaultMessage="Disputed" />
                </Label>
            );
        case "canceled":
            return (
                <Label variant="ghost" color="error">
                    <FormattedMessage defaultMessage="Canceled" />
                </Label>
            );
        default:
            return <Confirmation />;
    }
};

const Confirmation = () => {
    const {trade, fetchTrade} = useContext(PeerTradeContext);

    if (trade.confirmed) {
        return (
            <Chip
                label={
                    <Typography variant="subtitle1">
                        <FormattedMessage defaultMessage="Pending" />
                    </Typography>
                }
            />
        );
    }

    const renderer = ({minutes, seconds}) => (
        <Chip
            label={
                <Typography variant="subtitle1">
                    {`${minutes} : ${seconds}`}
                </Typography>
            }
        />
    );

    return (
        <Countdown
            onComplete={fetchTrade}
            date={parseDate(trade.expires_at).valueOf()}
            renderer={renderer}
        />
    );
};

export default TradeStatus;
