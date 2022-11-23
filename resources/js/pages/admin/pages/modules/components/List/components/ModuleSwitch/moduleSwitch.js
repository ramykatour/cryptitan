import React, {useCallback, useContext} from "react";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotDisturbIcon from "@mui/icons-material/DoNotDisturbOn";
import PopConfirm from "components/PopConfirm";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {defineMessages, useIntl} from "react-intl";
import TableContext from "contexts/TableContext";

const messages = defineMessages({
    disabled: {defaultMessage: "Module was disabled."},
    confirmDisable: {defaultMessage: "Disable this module?"},
    enabled: {defaultMessage: "Module was enabled."},
    confirmEnable: {defaultMessage: "Enable this module?"}
});

const ModuleSwitch = ({module}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const enable = useCallback(() => {
        request
            .patch(route("admin.module.enable", {module: module.name}))
            .then(() => {
                notify.success(intl.formatMessage(messages.enabled));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, module, intl, reloadTable]);

    const disable = useCallback(() => {
        request
            .patch(route("admin.module.disable", {module: module.name}))
            .then(() => {
                notify.success(intl.formatMessage(messages.disabled));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, module, intl, reloadTable]);

    return module.status ? (
        <PopConfirm
            component={IconButton}
            content={intl.formatMessage(messages.confirmDisable)}
            onClick={disable}>
            <LoadingIcon
                color="error"
                component={NotDisturbIcon}
                loading={loading}
            />
        </PopConfirm>
    ) : (
        <PopConfirm
            component={IconButton}
            content={intl.formatMessage(messages.confirmEnable)}
            onClick={enable}>
            <LoadingIcon
                color="success"
                component={CheckCircleIcon}
                loading={loading}
            />
        </PopConfirm>
    );
};

export default ModuleSwitch;
