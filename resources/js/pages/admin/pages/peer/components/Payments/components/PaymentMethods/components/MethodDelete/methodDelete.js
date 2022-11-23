import React, {useCallback, useContext} from "react";
import {defineMessages, useIntl} from "react-intl";
import TableContext from "contexts/TableContext";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import PopConfirm from "components/PopConfirm";

const messages = defineMessages({
    success: {defaultMessage: "Method was removed."}
});

const MethodDelete = ({method}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const deleteMethod = useCallback(() => {
        const url = route("admin.peer-payment-method.delete", {
            method: method.id
        });

        request
            .delete(url)
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, method, reloadTable, intl]);

    return (
        <PopConfirm component={IconButton} onClick={deleteMethod}>
            <LoadingIcon
                color="error"
                component={DeleteIcon}
                loading={loading}
            />
        </PopConfirm>
    );
};

export default MethodDelete;
