import React, {
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {IconButton, InputAdornment, MenuItem, Stack} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Form, {TextField} from "components/Form";
import TableContext from "contexts/TableContext";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import ModalContent from "components/ModalContent";
import Spin from "components/Spin";
import CategoryIcon from "@mui/icons-material/Category";
import ModalActions from "components/ModalActions";
import {LoadingButton} from "@mui/lab";
import {isEmpty} from "lodash";
import {notify} from "utils/index";

const messages = defineMessages({
    name: {defaultMessage: "Name"},
    description: {defaultMessage: "Description"},
    success: {defaultMessage: "Method was updated."},
    editMethod: {defaultMessage: "Edit Method"},
    category: {defaultMessage: "Category"}
});

const MethodEdit = ({method}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const editMethod = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.editMethod),
            content: <EditForm method={method} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, method]);

    return (
        <Fragment>
            <IconButton onClick={editMethod}>
                <EditIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const EditForm = ({closeModal, method}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [categories, setCategories] = useState([]);
    const {reload: reloadTable} = useContext(TableContext);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchCategories = useCallback(() => {
        request
            .get(route("admin.peer-payment-category.all"))
            .then((data) => setCategories(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const submitForm = useCallback(
        (values) => {
            const url = route("admin.peer-payment-method.update", {
                method: method.id
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
        [closeModal, formRequest, intl, method, reloadTable]
    );

    useEffect(() => {
        if (!isEmpty(method)) {
            form.resetFields();
        }
    }, [method, form]);

    return (
        <Form form={form} onFinish={submitForm}>
            <ModalContent>
                <Spin spinning={loading}>
                    <Stack spacing={2}>
                        <Form.Item
                            name="category_id"
                            initialValue={method.category_id}
                            label={intl.formatMessage(messages.category)}
                            rules={[{required: true}]}>
                            <TextField
                                fullWidth
                                select
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CategoryIcon />
                                        </InputAdornment>
                                    )
                                }}>
                                {categories.map((category) => (
                                    <MenuItem
                                        value={category.id}
                                        key={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Form.Item>

                        <Form.Item
                            name="name"
                            initialValue={method.name}
                            label={intl.formatMessage(messages.name)}
                            rules={[{required: true}]}>
                            <TextField fullWidth />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            initialValue={method.description}
                            label={intl.formatMessage(messages.description)}
                            rules={[{required: true}]}>
                            <TextField fullWidth multiline rows={3} />
                        </Form.Item>
                    </Stack>
                </Spin>
            </ModalContent>

            <ModalActions>
                <LoadingButton
                    variant="contained"
                    disabled={loading}
                    type="submit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Submit" />
                </LoadingButton>
            </ModalActions>
        </Form>
    );
};

export default MethodEdit;
