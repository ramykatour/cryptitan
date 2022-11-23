import React, {useCallback, useContext} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import {InputAdornment} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import PasswordIcon from "@mui/icons-material/Password";
import TableContext from "contexts/TableContext";
import ModalActions from "components/ModalActions";
import ModalContent from "components/ModalContent";

const messages = defineMessages({
    success: {defaultMessage: "Content was added."},
    code: {defaultMessage: "Code"},
    serial: {defaultMessage: "Serial"}
});

const AddStock = ({giftcard, closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            const url = route("admin.giftcard.content.create", {
                giftcard: giftcard.id
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
        [giftcard, closeModal, formRequest, intl, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <ModalContent spacing={2}>
                <Form.Item
                    name="serial"
                    label={intl.formatMessage(messages.serial)}
                    rules={[{required: true}]}>
                    <TextField fullWidth />
                </Form.Item>

                <Form.Item
                    name="code"
                    label={intl.formatMessage(messages.code)}
                    rules={[{required: true}]}>
                    <TextField
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PasswordIcon />
                                </InputAdornment>
                            )
                        }}
                    />
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

export default AddStock;
