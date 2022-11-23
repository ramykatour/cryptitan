import React, {useCallback, useContext} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingIcon from "components/LoadingIcon";
import TableContext from "contexts/TableContext";

const messages = defineMessages({
    success: {defaultMessage: "Wallet was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const WalletDelete = ({wallet}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const deleteWallet = useCallback(() => {
        const url = route("admin.wallet.delete", {
            identifier: wallet.coin.identifier
        });

        request
            .delete(url)
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, wallet, intl, reloadTable]);

    if (wallet.accounts_count > 0) {
        return null;
    }

    return (
        <PopConfirm
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={deleteWallet}>
            <LoadingIcon
                color="error"
                component={DeleteIcon}
                loading={loading}
            />
        </PopConfirm>
    );
};

export default WalletDelete;
