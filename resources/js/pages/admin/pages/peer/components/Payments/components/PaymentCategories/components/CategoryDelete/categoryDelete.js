import React, {useCallback, useContext} from "react";
import {defineMessages, useIntl} from "react-intl";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import TableContext from "contexts/TableContext";

const messages = defineMessages({
    success: {defaultMessage: "Category was removed."}
});

const CategoryDelete = ({category}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const deleteCategory = useCallback(() => {
        const url = route("admin.peer-payment-category.delete", {
            category: category.id
        });

        request
            .delete(url)
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, category, reloadTable, intl]);

    return (
        <PopConfirm component={IconButton} onClick={deleteCategory}>
            <LoadingIcon
                color="error"
                component={DeleteIcon}
                loading={loading}
            />
        </PopConfirm>
    );
};

export default CategoryDelete;
