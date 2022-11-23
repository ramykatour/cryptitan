import React, {useCallback, useContext} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PopConfirm from "components/PopConfirm";
import LoadingIcon from "components/LoadingIcon";
import TableContext from "contexts/TableContext";

const messages = defineMessages({
    success: {defaultMessage: "Currency was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const CurrencyDelete = ({currency}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const removeCurrency = useCallback(() => {
        const url = route("admin.payment.supported-currency.delete", {
            currency: currency.code
        });

        request
            .delete(url)
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, currency, intl, reloadTable]);

    if (currency.default) {
        return null;
    }

    return (
        <PopConfirm component={IconButton} onClick={removeCurrency}>
            <LoadingIcon
                color="error"
                component={DeleteIcon}
                loading={loading}
            />
        </PopConfirm>
    );
};

export default CurrencyDelete;
