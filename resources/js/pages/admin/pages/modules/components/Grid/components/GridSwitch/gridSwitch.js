import React, {useCallback, useContext} from "react";
import {defineMessages, useIntl} from "react-intl";
import TableContext from "contexts/TableContext";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import NotDisturbIcon from "@mui/icons-material/DoNotDisturbOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const messages = defineMessages({
    disabled: {defaultMessage: "Widget was disabled."},
    confirmDisable: {defaultMessage: "Disable this widget?"},
    enabled: {defaultMessage: "Widget was enabled."},
    confirmEnable: {defaultMessage: "Enable this widget?"}
});

const GridSwitch = ({grid}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const enable = useCallback(() => {
        request
            .patch(route("admin.grid.enable", {grid: grid.id}))
            .then(() => {
                notify.success(intl.formatMessage(messages.enabled));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, grid, intl, reloadTable]);

    const disable = useCallback(() => {
        request
            .patch(route("admin.grid.disable", {grid: grid.id}))
            .then(() => {
                notify.success(intl.formatMessage(messages.disabled));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, grid, intl, reloadTable]);

    return grid.status ? (
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

export default GridSwitch;
