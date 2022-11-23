import React, {useCallback, useContext} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import CancelIcon from "@mui/icons-material/Cancel";
import TableContext from "contexts/TableContext";

const messages = defineMessages({
    success: {defaultMessage: "Trade was canceled."},
    confirm: {defaultMessage: "Are you sure?"}
});

const Cancel = ({trade}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const cancelPending = useCallback(() => {
        const url = route("admin.exchange-trade.cancel-pending", {
            trade: trade.id
        });

        request
            .patch(url)
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, trade, intl, reloadTable]);

    if (trade.status !== "pending") {
        return null;
    }

    return (
        <PopConfirm
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={cancelPending}>
            <LoadingIcon
                component={CancelIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default Cancel;
