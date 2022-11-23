import React, {useCallback, useContext} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import PopConfirm from "components/PopConfirm";
import TableContext from "contexts/TableContext";

const messages = defineMessages({
    success: {defaultMessage: "Brand was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const BrandDelete = ({brand}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const deleteBrand = useCallback(() => {
        const url = route("admin.giftcard.brand.delete", {brand: brand.id});

        request
            .delete(url)
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, brand, intl, reloadTable]);

    return (
        <PopConfirm
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={deleteBrand}>
            <LoadingIcon
                component={DeleteIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default BrandDelete;
