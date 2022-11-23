import React, {Fragment, useCallback, useContext, useEffect} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import {isEmpty} from "lodash";
import {LoadingButton} from "@mui/lab";
import TableContext from "contexts/TableContext";
import ModalActions from "components/ModalActions";
import ModalContent from "components/ModalContent";

const messages = defineMessages({
    success: {defaultMessage: "Brand was updated."},
    editBrand: {defaultMessage: "Edit Brand"},
    name: {defaultMessage: "Name"},
    description: {defaultMessage: "Description"}
});

const BrandEdit = ({brand}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const editBrand = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.editBrand),
            content: <EditForm brand={brand} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, brand]);

    return (
        <Fragment>
            <IconButton onClick={editBrand}>
                <EditIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const EditForm = ({closeModal, brand}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            const url = route("admin.giftcard.brand.update", {brand: brand.id});

            formRequest
                .put(url, values)
                .then(() => {
                    reloadTable();
                    notify.success(intl.formatMessage(messages.success));
                    closeModal();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, brand, reloadTable]
    );

    useEffect(() => {
        if (!isEmpty(brand)) {
            form.resetFields();
        }
    }, [brand, form]);

    return (
        <Form form={form} onFinish={submitForm}>
            <ModalContent spacing={2}>
                <Form.Item
                    name="name"
                    initialValue={brand.name}
                    label={intl.formatMessage(messages.name)}
                    rules={[{required: true}]}>
                    <TextField fullWidth />
                </Form.Item>

                <Form.Item
                    name="description"
                    initialValue={brand.description}
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

export default BrandEdit;
