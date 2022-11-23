import React, {useCallback, useContext, useEffect, useState} from "react";
import {Button, Grid, MenuItem} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import AddIcon from "@mui/icons-material/Add";
import {useModal} from "utils/modal";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTable from "components/SearchTable";
import TableContext from "contexts/TableContext";
import ModalActions from "components/ModalActions";

const messages = defineMessages({
    success: {defaultMessage: "Wallet was added."},
    search: {defaultMessage: "Search coin..."},
    addWallet: {defaultMessage: "Add Wallet"},
    confirmations: {defaultMessage: "Confirmations"},
    adapter: {defaultMessage: "Adapter"}
});

const ActionBar = () => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const addWallet = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addWallet),
            content: <CreateForm />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl]);

    return (
        <StyledToolbar>
            <SearchTable
                field="searchCoin"
                placeholder={intl.formatMessage(messages.search)}
                withParams={true}
            />

            {modalElements}

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addWallet}>
                <FormattedMessage defaultMessage="Add Wallet" />
            </Button>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [adapters, setAdapters] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const fetchAdapters = useCallback(() => {
        request
            .get(route("admin.wallet.get-adapters"))
            .then((data) => setAdapters(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchAdapters();
    }, [fetchAdapters]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.wallet.create"), values)
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
            <Spin spinning={loading}>
                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        <Form.Item
                            name="adapter"
                            label={intl.formatMessage(messages.adapter)}
                            rules={[{required: true}]}>
                            <TextField fullWidth select>
                                {adapters.map((adapter, key) => (
                                    <MenuItem value={adapter.class} key={key}>
                                        {adapter.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Form.Item>
                    </Grid>

                    <Grid item xs={4}>
                        <Form.Item
                            name="min_conf"
                            rules={[{required: true, type: "number"}]}
                            label={intl.formatMessage(messages.confirmations)}
                            normalize={(v) => v && parseInt(v)}
                            initialValue={3}>
                            <TextField fullWidth />
                        </Form.Item>
                    </Grid>
                </Grid>

                <ModalActions>
                    <LoadingButton
                        variant="contained"
                        disabled={loading}
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </ModalActions>
            </Spin>
        </Form>
    );
};

export default ActionBar;
