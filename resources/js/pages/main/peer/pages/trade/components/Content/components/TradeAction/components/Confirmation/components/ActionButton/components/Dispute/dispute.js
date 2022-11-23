import React, {useCallback, useContext} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import PeerTradeContext from "contexts/PeerTradeContext";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {LoadingButton} from "@mui/lab";
import PopConfirm from "components/PopConfirm";
import {parseDate} from "utils/form";
import Countdown from "react-countdown";

const messages = defineMessages({
    success: {defaultMessage: "Trade was disputed."},
    confirm: {defaultMessage: "Raise dispute on trade?"}
});

const Dispute = () => {
    const intl = useIntl();
    const {trade} = useContext(PeerTradeContext);
    const [request, loading] = useRequest();

    const dispute = useCallback(() => {
        request
            .patch(route("peer-trade.dispute", {trade: trade.id}))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
            })
            .catch(errorHandler());
    }, [request, intl, trade]);

    return (
        <PopConfirm
            color="inherit"
            component={LoadingButton}
            content={intl.formatMessage(messages.confirm)}
            disabled={!trade.disputable}
            variant="contained"
            loading={loading}
            onClick={dispute}
            fullWidth>
            {trade.disputable ? (
                <FormattedMessage defaultMessage="Dispute" />
            ) : (
                <Timer />
            )}
        </PopConfirm>
    );
};

const Timer = () => {
    const {trade, fetchTrade} = useContext(PeerTradeContext);

    const renderer = ({minutes, seconds}) => `${minutes}:${seconds}`;

    return (
        <Countdown
            onComplete={fetchTrade}
            date={parseDate(trade.disputable_from).valueOf()}
            renderer={renderer}
        />
    );
};

export default Dispute;
