import React, {useCallback, useContext} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TableContext from "contexts/TableContext";

const messages = defineMessages({
    success: {defaultMessage: "Trade was completed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const Complete = ({trade}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const completePending = useCallback(() => {
        const url = route("admin.exchange-trade.complete-pending-buy", {
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
            onClick={completePending}>
            <LoadingIcon
                component={CheckCircleIcon}
                color="success"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default Complete;
