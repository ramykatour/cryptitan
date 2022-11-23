import React, {Fragment, useCallback, useContext, useEffect} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {isEmpty} from "lodash";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";
import TableContext from "contexts/TableContext";
import ModalContent from "components/ModalContent";
import ModalActions from "components/ModalActions";

const messages = defineMessages({
    success: {defaultMessage: "Requirement was updated."},
    edit: {defaultMessage: "Edit Requirement"},
    name: {defaultMessage: "Name"},
    description: {defaultMessage: "Description"}
});

const DocumentEdit = ({document}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const editDocument = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.edit),
            content: <EditForm document={document} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, document]);

    return (
        <Fragment>
            <IconButton onClick={editDocument}>
                <EditIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const EditForm = ({closeModal, document}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);
    const {reload: reloadTable} = useContext(TableContext);

    useEffect(() => {
        if (!isEmpty(document)) {
            form.resetFields();
        }
    }, [document, form]);

    const submitForm = useCallback(
        (values) => {
            const url = route("admin.required-document.update", {
                document: document.id
            });

            formRequest
                .put(url, values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [closeModal, document, formRequest, intl, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <ModalContent spacing={2}>
                <Form.Item
                    name="name"
                    initialValue={document.name}
                    label={intl.formatMessage(messages.name)}
                    rules={[{required: true}]}>
                    <TextField fullWidth />
                </Form.Item>

                <Form.Item
                    name="description"
                    initialValue={document.description}
                    label={intl.formatMessage(messages.description)}
                    rules={[{required: true}]}>
                    <TextField fullWidth multiline rows={3} />
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

export default DocumentEdit;
