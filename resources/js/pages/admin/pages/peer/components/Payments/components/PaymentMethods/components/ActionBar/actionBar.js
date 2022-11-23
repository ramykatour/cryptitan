import React, {useCallback, useContext, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import SearchTable from "components/SearchTable";
import {Button, InputAdornment, MenuItem, Stack} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {StyledToolbar} from "styles/toolbar.style";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import TableContext from "contexts/TableContext";
import Spin from "components/Spin";
import ModalContent from "components/ModalContent";
import {LoadingButton} from "@mui/lab";
import ModalActions from "components/ModalActions";
import CategoryIcon from "@mui/icons-material/Category";

const messages = defineMessages({
    category: {defaultMessage: "Category"},
    name: {defaultMessage: "Name"},
    success: {defaultMessage: "Method was created."},
    search: {defaultMessage: "Search method..."},
    createMethod: {defaultMessage: "Create Method"},
    description: {defaultMessage: "Description"}
});

const ActionBar = () => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const create = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.createMethod),
            content: <CreateForm />,
            rootProps: {fullWidth: true}
        });
    }, [intl, modal]);

    return (
        <StyledToolbar>
            <SearchTable
                sx={{mr: 2}}
                placeholder={intl.formatMessage(messages.search)}
                field="name"
            />

            {modalElements}

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={create}>
                <FormattedMessage defaultMessage="Create" />
            </Button>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal}) => {
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
            formRequest
                .post(route("admin.peer-payment-method.create"), values)
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
                <Spin spinning={loading}>
                    <Stack spacing={2}>
                        <Form.Item
                            name="category_id"
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
                            label={intl.formatMessage(messages.name)}
                            rules={[{required: true}]}>
                            <TextField fullWidth />
                        </Form.Item>

                        <Form.Item
                            name="description"
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

export default ActionBar;
