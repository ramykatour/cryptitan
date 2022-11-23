import React, {useCallback, useContext} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import TableContext from "contexts/TableContext";

const messages = defineMessages({
    success: {defaultMessage: "Bank was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const BankDelete = ({bank}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const removeBank = useCallback(() => {
        request
            .delete(route("admin.bank.delete", {bank: bank.id}))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, bank, intl, reloadTable]);

    return (
        <PopConfirm component={IconButton} onClick={removeBank}>
            <LoadingIcon
                color="error"
                component={DeleteIcon}
                loading={loading}
            />
        </PopConfirm>
    );
};

export default BankDelete;
