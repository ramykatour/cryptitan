import React, {Fragment, useCallback, useContext} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {IconButton, Stack} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import Form, {DateTimePicker} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import UserContext from "contexts/UserContext";
import {normalizeDate} from "utils/form";
import {notify} from "utils/index";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    until: {defaultMessage: "Until"},
    activated: {defaultMessage: "User was activated."},
    deactivateUser: {defaultMessage: "Deactivate User"},
    updateUser: {defaultMessage: "Update User"},
    deactivated: {defaultMessage: "User was deactivated."},
    success: {defaultMessage: "User was updated."},
    lastName: {defaultMessage: "Last Name"},
    firstName: {defaultMessage: "First Name"},
    country: {defaultMessage: "Country"}
});

const Deactivate = () => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const deactivateUser = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.deactivateUser),
            content: <DeactivateForm />
        });
    }, [modal, intl]);

    return (
        <Fragment>
            <IconButton size="small" onClick={deactivateUser}>
                <BlockIcon fontSize="inherit" />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const DeactivateForm = ({closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);
    const {user, fetchUser} = useContext(UserContext);

    const submitForm = useCallback(
        (values) => {
            normalizeDate(values, "date");

            formRequest
                .post(route("admin.user.deactivate", {user: user.id}), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.deactivated));
                    fetchUser();
                    closeModal();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, user, fetchUser]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Form.Item
                name="date"
                label={intl.formatMessage(messages.until)}
                rules={[{required: true}]}>
                <DateTimePicker fullWidth />
            </Form.Item>

            <Stack direction="row" justifyContent="flex-end" my={2}>
                <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Submit" />
                </LoadingButton>
            </Stack>
        </Form>
    );
};

export default Deactivate;
