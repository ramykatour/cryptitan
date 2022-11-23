import React, {useCallback, useContext} from "react";
import {LoadingButton} from "@mui/lab";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import PeerTradeContext from "contexts/PeerTradeContext";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";

const messages = defineMessages({
    success: {defaultMessage: "Trade was confirmed."},
    confirm: {defaultMessage: "Confirm trade payment?"}
});

const Confirm = () => {
    const intl = useIntl();
    const {trade} = useContext(PeerTradeContext);
    const [request, loading] = useRequest();

    const confirm = useCallback(() => {
        request
            .patch(route("peer-trade.confirm", {trade: trade.id}))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
            })
            .catch(errorHandler());
    }, [request, intl, trade]);

    return (
        <PopConfirm
            color="primary"
            component={LoadingButton}
            content={intl.formatMessage(messages.confirm)}
            disabled={!trade.confirmable}
            variant="contained"
            loading={loading}
            onClick={confirm}
            fullWidth>
            <FormattedMessage defaultMessage="Mark As Paid" />
        </PopConfirm>
    );
};

export default Confirm;
