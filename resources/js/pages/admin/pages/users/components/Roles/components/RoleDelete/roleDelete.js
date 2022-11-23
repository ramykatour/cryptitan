import React, {useCallback, useContext} from "react";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {defineMessages, useIntl} from "react-intl";
import PopConfirm from "components/PopConfirm";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import LoadingIcon from "components/LoadingIcon";
import TableContext from "contexts/TableContext";

const messages = defineMessages({
    success: {defaultMessage: "Role was deleted."},
    confirm: {defaultMessage: "Are you sure?"}
});

const RoleDelete = ({role}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const deleteRole = useCallback(() => {
        request
            .delete(route("admin.role.delete", {role: role.id}))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, role, intl, reloadTable]);

    if (role.protected) {
        return null;
    }

    return (
        <PopConfirm
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={deleteRole}>
            <LoadingIcon
                color="error"
                component={DeleteIcon}
                loading={loading}
            />
        </PopConfirm>
    );
};

export default RoleDelete;
