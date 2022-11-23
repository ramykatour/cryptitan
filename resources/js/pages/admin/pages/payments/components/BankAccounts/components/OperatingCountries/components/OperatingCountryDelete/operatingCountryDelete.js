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
    success: {defaultMessage: "Country was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const OperatingCountryDelete = ({country}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const removeCountry = useCallback(() => {
        const url = route("admin.bank.operating-country.delete", {
            country: country.code
        });

        request
            .delete(url)
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, country, intl, reloadTable]);

    return (
        <PopConfirm component={IconButton} onClick={removeCountry}>
            <LoadingIcon
                color="error"
                component={DeleteIcon}
                loading={loading}
            />
        </PopConfirm>
    );
};

export default OperatingCountryDelete;
