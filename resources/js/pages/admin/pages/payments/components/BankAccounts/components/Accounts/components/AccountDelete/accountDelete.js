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
    success: {defaultMessage: "Bank account was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const AccountDelete = ({account}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const removeBankAccount = useCallback(() => {
        const url = route("admin.bank.account.delete", {account: account.id});

        request
            .delete(url)
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, account, intl, reloadTable]);

    return (
        <PopConfirm
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={removeBankAccount}>
            <LoadingIcon
                component={DeleteIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default AccountDelete;
