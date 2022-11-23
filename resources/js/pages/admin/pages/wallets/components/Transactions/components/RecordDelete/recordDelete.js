import React, {Fragment, useCallback, useContext} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {Alert, IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PopConfirm from "components/PopConfirm";
import {useModal} from "utils/modal";
import {errorHandler, route, useFormRequest} from "services/Http";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";
import Form from "components/Form";
import TwoFactorField from "components/TwoFactorField";
import TableContext from "contexts/TableContext";
import ModalActions from "components/ModalActions";
import ModalContent from "components/ModalContent";

const messages = defineMessages({
    success: {defaultMessage: "Record was removed."},
    confirm: {defaultMessage: "Are you sure?"},
    confirmAction: {defaultMessage: "Confirm Action"},
    token: {defaultMessage: "Token"},
    password: {defaultMessage: "Password"}
});

const RecordDelete = ({record}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const deleteRecord = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.confirmAction),
            content: <ConfirmAction record={record} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, record]);

    if (!record.removable) {
        return null;
    }

    return (
        <Fragment>
            <PopConfirm
                component={IconButton}
                content={intl.formatMessage(messages.confirm)}
                onClick={deleteRecord}>
                <DeleteIcon color="error" />
            </PopConfirm>

            {modalElements}
        </Fragment>
    );
};

const ConfirmAction = ({record, closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);
    const {reload: reloadTable} = useContext(TableContext);

    const submitForm = useCallback(
        (values) => {
            const url = route("admin.wallet.transfer-record.remove", {
                record: record.id
            });

            formRequest
                .post(url, values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, reloadTable, record]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <ModalContent spacing={2}>
                <Alert severity="error">
                    <FormattedMessage defaultMessage="You should ONLY remove a transaction if you are absolutely sure it did not go through. Check the address on the blockchain explorer before you proceed!" />
                </Alert>

                <TwoFactorField />
            </ModalContent>

            <ModalActions>
                <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Remove Transfer" />
                </LoadingButton>
            </ModalActions>
        </Form>
    );
};

export default RecordDelete;
