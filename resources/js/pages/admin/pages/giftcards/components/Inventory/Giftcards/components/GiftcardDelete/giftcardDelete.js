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
    success: {defaultMessage: "Giftcard was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const GiftcardDelete = ({giftcard}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const deleteGiftcard = useCallback(() => {
        const url = route("admin.giftcard.delete", {giftcard: giftcard.id});
        request
            .delete(url)
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, giftcard, intl, reloadTable]);

    return (
        <PopConfirm component={IconButton} onClick={deleteGiftcard}>
            <LoadingIcon
                color="error"
                component={DeleteIcon}
                loading={loading}
            />
        </PopConfirm>
    );
};

export default GiftcardDelete;
