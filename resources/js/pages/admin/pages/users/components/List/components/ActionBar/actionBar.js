import React, {useCallback, useContext} from "react";
import {IconButton, Stack, Tooltip, Typography} from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import Form, {DateTimePicker} from "components/Form";
import {normalizeDate} from "utils/form";
import {LoadingButton} from "@mui/lab";
import {useModal} from "utils/modal";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTable from "components/SearchTable";
import TableContext from "contexts/TableContext";
import ModalActions from "components/ModalActions";

const messages = defineMessages({
    search: {defaultMessage: "Search name..."},
    batchDeactivate: {defaultMessage: "Deactivate Users"},
    activate: {defaultMessage: "Activate"},
    deactivate: {defaultMessage: "Deactivate"},
    deactivated: {defaultMessage: "Users were deactivated."},
    activated: {defaultMessage: "Users were activated."},
    until: {defaultMessage: "Until"}
});

const ActionBar = () => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();
    const {reload: reloadTable, selection} = useContext(TableContext);
    const [request] = useRequest();

    const batchActivate = useCallback(() => {
        request
            .post(route("admin.user.batch-activate"), {users: selection})
            .then(() => {
                notify.success(intl.formatMessage(messages.activated));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, selection, intl, reloadTable]);

    const batchDeactivate = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.batchDeactivate),
            content: <DeactivateUsers />
        });
    }, [modal, intl]);

    return (
        <StyledToolbar>
            {selection.length > 0 ? (
                <Typography variant="subtitle1">
                    <FormattedMessage
                        values={{selection: <b>{selection.length}</b>}}
                        defaultMessage="{selection} selected"
                    />
                </Typography>
            ) : (
                <SearchTable
                    sx={{mr: 2}}
                    placeholder={intl.formatMessage(messages.search)}
                    field="name"
                />
            )}

            {modalElements}

            {selection.length > 0 && (
                <Stack direction="row" spacing={1}>
                    <Tooltip title={intl.formatMessage(messages.deactivate)}>
                        <IconButton onClick={batchDeactivate}>
                            <GavelIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={intl.formatMessage(messages.activate)}>
                        <IconButton onClick={batchActivate}>
                            <SettingsBackupRestoreIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            )}
        </StyledToolbar>
    );
};

const DeactivateUsers = ({closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const {reload: reloadTable, selection} = useContext(TableContext);
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            normalizeDate(values, "date");
            values.users = selection;

            formRequest
                .post(route("admin.user.batch-deactivate"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.deactivated));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, selection, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Form.Item
                name="date"
                label={intl.formatMessage(messages.until)}
                rules={[{required: true}]}>
                <DateTimePicker fullWidth />
            </Form.Item>

            <ModalActions>
                <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Submit" />
                </LoadingButton>
            </ModalActions>
        </Form>
    );
};

export default ActionBar;
