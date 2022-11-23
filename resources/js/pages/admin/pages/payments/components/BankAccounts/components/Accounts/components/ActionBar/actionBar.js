import React, {useCallback, useContext, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {StyledToolbar} from "styles/toolbar.style";
import {Button, Divider, InputAdornment, MenuItem, Stack} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import Spin from "components/Spin";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonIcon from "@mui/icons-material/Person";
import QrCodeIcon from "@mui/icons-material/QrCode";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";
import {useSupportedCurrencies} from "hooks/global";
import TwoFactorField from "components/TwoFactorField";
import SearchTable from "components/SearchTable";
import TableContext from "contexts/TableContext";
import ModalContent from "components/ModalContent";
import ModalActions from "components/ModalActions";

const messages = defineMessages({
    success: {defaultMessage: "Bank account was created."},
    search: {defaultMessage: "Search by number..."},
    addBankAccount: {defaultMessage: "Add Bank Account"},
    name: {defaultMessage: "Name"},
    operatingCountries: {defaultMessage: "Operating Countries"},
    beneficiary: {defaultMessage: "Beneficiary"},
    number: {defaultMessage: "Number"},
    note: {defaultMessage: "Note"},
    bank: {defaultMessage: "Bank"},
    password: {defaultMessage: "Password"},
    token: {defaultMessage: "Token"},
    currency: {defaultMessage: "Currency"},
    country: {defaultMessage: "Country"}
});

const ActionBar = () => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const addBankAccount = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addBankAccount),
            content: <CreateForm />,
            rootProps: {fullWidth: true}
        });
    }, [intl, modal]);

    return (
        <StyledToolbar>
            <SearchTable
                sx={{mr: 2}}
                placeholder={intl.formatMessage(messages.search)}
                field="number"
            />

            {modalElements}

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addBankAccount}>
                <FormattedMessage defaultMessage="Add Account" />
            </Button>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [banks, setBanks] = useState([]);
    const [countries, setCountries] = useState([]);
    const {reload: reloadTable} = useContext(TableContext);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchBanks = useCallback(() => {
        request
            .get(route("admin.bank.get-operating-banks"))
            .then((data) => setBanks(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    const handleValuesChange = useCallback(
        (values) => {
            if (values.bank_id) {
                const selected = banks.find((bank) => {
                    return bank.id === values.bank_id;
                });

                const operatingCountries = selected?.operating_countries;
                setCountries(operatingCountries);

                form.setFieldsValue({
                    country: operatingCountries[0]?.code
                });
            }
        },
        [form, banks]
    );

    const {currencies} = useSupportedCurrencies();

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.bank.account.create"), values)
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
        <Form
            form={form}
            onValuesChange={handleValuesChange}
            onFinish={submitForm}>
            <Spin spinning={loading}>
                <ModalContent spacing={2}>
                    <Form.Item
                        name="bank_id"
                        label={intl.formatMessage(messages.bank)}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBalanceIcon />
                                    </InputAdornment>
                                )
                            }}
                            select>
                            {banks.map((bank) => (
                                <MenuItem value={bank.id} key={bank.id}>
                                    {bank.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Form.Item>

                    <Stack direction="row" spacing={2}>
                        <Form.Item
                            name="currency"
                            label={intl.formatMessage(messages.currency)}
                            rules={[{required: true}]}>
                            <TextField fullWidth select>
                                {currencies.map((currency) => (
                                    <MenuItem
                                        value={currency.code}
                                        key={currency.code}>
                                        {`${currency.name} (${currency.code})`}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Form.Item>

                        <Form.Item
                            name="country"
                            label={intl.formatMessage(messages.country)}
                            rules={[{required: true}]}>
                            <TextField select fullWidth>
                                {countries.map((country) => (
                                    <MenuItem
                                        value={country.code}
                                        key={country.code}>
                                        {`${country.name}`}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Form.Item>
                    </Stack>

                    <Divider>
                        <FormattedMessage defaultMessage="Account Details" />
                    </Divider>

                    <Form.Item
                        name="beneficiary"
                        label={intl.formatMessage(messages.beneficiary)}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="number"
                        label={intl.formatMessage(messages.number)}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <QrCodeIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="note"
                        label={intl.formatMessage(messages.note)}
                        rules={[{required: true}]}>
                        <TextField fullWidth multiline rows={3} />
                    </Form.Item>

                    <Divider>
                        <FormattedMessage defaultMessage="Verification" />
                    </Divider>

                    <TwoFactorField />
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
