import React, {useCallback, useContext} from "react";
import {LoadingButton} from "@mui/lab";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import PeerTradeContext from "contexts/PeerTradeContext";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";

const messages = defineMessages({
    success: {defaultMessage: "Trade was canceled."},
    confirm: {defaultMessage: "Cancel this trade?"}
});

const Cancel = () => {
    const intl = useIntl();
    const {trade} = useContext(PeerTradeContext);
    const [request, loading] = useRequest();

    const cancel = useCallback(() => {
        request
            .patch(route("peer-trade.cancel", {trade: trade.id}))
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
            disabled={!trade.cancelable}
            variant="outlined"
            onClick={cancel}
            loading={loading}>
            <FormattedMessage defaultMessage="Cancel" />
        </PopConfirm>
    );
};

export default Cancel;
