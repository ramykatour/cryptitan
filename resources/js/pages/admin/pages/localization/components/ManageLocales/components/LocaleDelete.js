import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import React, {useCallback} from "react";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";

const messages = defineMessages({
    success: {defaultMessage: "Locale was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const LocaleDelete = ({locale, reloadTable}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const removeLocale = useCallback(() => {
        const values = {locale: locale.locale};

        request
            .post(route("admin.locale.remove"), values)
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, locale, intl, reloadTable]);

    if (locale.locale === "en") {
        return null;
    }

    return (
        <PopConfirm
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={removeLocale}>
            <LoadingIcon
                color="error"
                component={DeleteIcon}
                loading={loading}
            />
        </PopConfirm>
    );
};

export default LocaleDelete;
