import React, {Fragment, useCallback, useContext, useEffect} from "react";
import {IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import TableContext from "contexts/TableContext";
import {isEmpty} from "lodash";
import {notify} from "utils/index";
import {LoadingButton} from "@mui/lab";
import ModalContent from "components/ModalContent";
import ModalActions from "components/ModalActions";

const messages = defineMessages({
    name: {defaultMessage: "Name"},
    success: {defaultMessage: "Category was updated."},
    editCategory: {defaultMessage: "Edit Category"},
    description: {defaultMessage: "Description"}
});

const CategoryEdit = ({category}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const editCategory = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.editCategory),
            content: <EditForm category={category} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, category]);

    return (
        <Fragment>
            <IconButton onClick={editCategory}>
                <EditIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const EditForm = ({closeModal, category}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            const url = route("admin.peer-payment-category.update", {
                category: category.id
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
        [closeModal, formRequest, intl, category, reloadTable]
    );

    useEffect(() => {
        if (!isEmpty(category)) {
            form.resetFields();
        }
    }, [category, form]);

    return (
        <Form form={form} onFinish={submitForm}>
            <ModalContent spacing={2}>
                <Form.Item
                    name="name"
                    initialValue={category.name}
                    label={intl.formatMessage(messages.name)}
                    rules={[{required: true}]}>
                    <TextField fullWidth />
                </Form.Item>

                <Form.Item
                    name="description"
                    initialValue={category.description}
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

export default CategoryEdit;
