import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import React, {Fragment, useCallback} from "react";
import {Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import {LoadingButton} from "@mui/lab";
import ModalActions from "components/ModalActions";
import ModalContent from "components/ModalContent";

const messages = defineMessages({
    code: {defaultMessage: "ISO-2 Code"},
    success: {defaultMessage: "Locale was added."},
    addLocale: {defaultMessage: "Add Locale"}
});

const Action = ({reloadTable}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const addLocale = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addLocale),
            content: <CreateForm reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [intl, reloadTable, modal]);

    return (
        <Fragment>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addLocale}>
                <FormattedMessage defaultMessage="Add Locale" />
            </Button>

            {modalElements}
        </Fragment>
    );
};

const CreateForm = ({reloadTable, closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.locale.add"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <ModalContent>
                <Form.Item
                    name="locale"
                    label={intl.formatMessage(messages.code)}
                    rules={[{required: true}]}>
                    <TextField fullWidth />
                </Form.Item>
            </ModalContent>

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

export default Action;
