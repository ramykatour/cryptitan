import React, {useCallback, useContext, useEffect} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {StyledToolbar} from "styles/toolbar.style";
import {Button, MenuItem} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Form, {MultiSelect, TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {useDispatch} from "react-redux";
import {fetchOperatingCountries} from "redux/slices/global";
import {notify} from "utils/index";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";
import {useOperatingCountries} from "hooks/global";
import SearchTable from "components/SearchTable";
import TableContext from "contexts/TableContext";
import ModalContent from "components/ModalContent";
import ModalActions from "components/ModalActions";

const messages = defineMessages({
    addBank: {defaultMessage: "Add Bank"},
    success: {defaultMessage: "Bank was created."},
    search: {defaultMessage: "Search bank..."},
    name: {defaultMessage: "Name"},
    operatingCountries: {defaultMessage: "Operating Countries"},
    auto: {defaultMessage: "Auto"},
    manual: {defaultMessage: "Manual"},
    rate: {defaultMessage: "Rate"}
});

const ActionBar = () => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const addBank = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addBank),
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
                onClick={addBank}>
                <FormattedMessage defaultMessage="Add Bank" />
            </Button>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);
    const {reload: reloadTable} = useContext(TableContext);
    const dispatch = useDispatch();

    const {countries, loading} = useOperatingCountries();

    useEffect(() => {
        dispatch(fetchOperatingCountries());
    }, [dispatch]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.bank.create"), values)
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
                <ModalContent spacing={2}>
                    <Form.Item
                        name="name"
                        label={intl.formatMessage(messages.name)}
                        rules={[{required: true}]}>
                        <TextField fullWidth />
                    </Form.Item>

                    <Form.Item
                        name="operating_countries"
                        label={intl.formatMessage(messages.operatingCountries)}
                        rules={[{required: true}]}>
                        <MultiSelect fullWidth>
                            {countries.map((country, key) => (
                                <MenuItem key={key} value={country.code}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </MultiSelect>
                    </Form.Item>
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
            </Spin>
        </Form>
    );
};

export default ActionBar;
