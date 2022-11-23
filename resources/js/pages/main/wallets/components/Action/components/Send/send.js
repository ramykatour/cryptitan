import React, {useCallback, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useActiveWalletAccount} from "hooks/account";
import {isEmpty, round} from "lodash";
import {fetchWalletAccounts, setActiveAccount} from "redux/slices/wallet";
import {useDispatch} from "react-redux";
import InputAmount from "./components/InputAmount";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import ConfirmAction from "./components/ConfirmAction";
import Completed from "./components/Completed";
import {Box, InputAdornment, Stack} from "@mui/material";
import Form, {TextField} from "components/Form";
import {useModal} from "utils/modal";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";
import ContactsIcon from "@mui/icons-material/Contacts";
import Value from "utils/classes/Value";
import {useChangeDetect} from "models/Model";
import AccountSelect from "components/AccountSelect";
import HiddenFields from "./components/HiddenFields";
import FeeEstimate from "./components/FeeEstimate";
import Information from "./components/Information";

const messages = defineMessages({
    address: {defaultMessage: "To"},
    addressPlace: {defaultMessage: "Email or coin address"},
    fee: {defaultMessage: "Fee"},
    account: {defaultMessage: "Select account"},
    confirm: {defaultMessage: "Confirm"},
    send: {defaultMessage: "Send"},
    amount: {defaultMessage: "Amount"},
    invalidToken: {defaultMessage: "Invalid token or password."}
});

const Send = () => {
    const [form] = Form.useForm();
    const account = useActiveWalletAccount();
    const accountChanged = useChangeDetect(account);
    const [feeEstimate, setFeeEstimate] = useState();
    const [modal, modalElements] = useModal();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const [lastSent, setLastSent] = useState();
    const dispatch = useDispatch();

    const fetchFeeEstimate = useCallback(() => {
        const url = route("wallet.account.estimate-fee", {id: account.id});

        const amount = Number(form.getFieldValue("amount"));
        const address = form.getFieldValue("address");

        request
            .post(url, {amount, address})
            .then((data) => setFeeEstimate(isEmpty(data) ? null : data))
            .catch(errorHandler());
    }, [request, form, account]);

    useEffect(() => {
        if (account.get("id") && accountChanged) {
            form.resetFields();
            form.setFieldsValue({account: account.get("id")});
        }
    }, [account, form, accountChanged]);

    useEffect(() => {
        if (account.isNotEmpty()) {
            fetchFeeEstimate();
        }
    }, [account, fetchFeeEstimate]);

    const handleValuesChange = useCallback(
        (values) => {
            if (values.account) {
                dispatch(setActiveAccount(values.account));
            }
        },
        [dispatch]
    );

    const getDeductible = useCallback(() => {
        const coin = account.wallet.coin;
        const amount = Number(form.getFieldValue("amount"));
        const value = !feeEstimate ? amount : amount + feeEstimate.value;
        return round(value, coin.precision);
    }, [account, feeEstimate, form]);

    const canSubmit = useCallback(() => {
        return (
            account.isNotEmpty() &&
            Number(form.getFieldValue("amount")) > 0 &&
            getDeductible() <= account.available
        );
    }, [getDeductible, account, form]);

    const submitForm = useCallback(
        (values) => {
            const url = route("wallet.account.send", {id: account.id});

            values.amount = Number(values.amount);

            formRequest
                .post(url, values)
                .then((data) => {
                    form.resetFields(["amount", "address"]);
                    dispatch(fetchWalletAccounts());
                    setFeeEstimate();
                    setLastSent(data);
                })
                .catch(errorHandler());
        },
        [formRequest, account, form, dispatch]
    );

    const confirmAction = useCallback(() => {
        form.validateFields()
            .then(() => {
                modal.confirm({
                    content: (
                        <ConfirmAction
                            getDeductible={getDeductible}
                            feeEstimate={feeEstimate}
                        />
                    )
                });
            })
            .catch(console.warn);
    }, [modal, feeEstimate, form, getDeductible]);

    return (
        <Box sx={{p: 3}}>
            <Completed lastSent={lastSent} onReset={() => setLastSent()} />

            <Spin spinning={loading}>
                <Form
                    form={form}
                    onValuesChange={handleValuesChange}
                    onFinish={submitForm}>
                    <Stack spacing={2}>
                        <AmountField onBlur={fetchFeeEstimate} />
                        <Information getDeductible={getDeductible} />

                        <AccountField />

                        <AddressField onBlur={fetchFeeEstimate} />
                        <FeeEstimate feeEstimate={feeEstimate} />

                        <Form.Item shouldUpdate>
                            {() => (
                                <LoadingButton
                                    variant="contained"
                                    onClick={confirmAction}
                                    loading={formLoading}
                                    disabled={!canSubmit()}
                                    fullWidth>
                                    <FormattedMessage defaultMessage="Continue" />
                                </LoadingButton>
                            )}
                        </Form.Item>
                    </Stack>

                    <HiddenFields />
                    {modalElements}
                </Form>
            </Spin>
        </Box>
    );
};

const AccountField = () => {
    const intl = useIntl();

    return (
        <Form.Item
            name="account"
            label={intl.formatMessage(messages.account)}
            rules={[{required: true}]}>
            <AccountSelect />
        </Form.Item>
    );
};

const AmountField = ({onBlur}) => {
    const intl = useIntl();
    const account = useActiveWalletAccount();

    if (account.isEmpty()) {
        return null;
    }

    return (
        <Stack alignItems="center">
            <Form.Item
                name="amount"
                label={intl.formatMessage(messages.amount)}
                rules={[Value.validate(intl), {required: true}]}>
                <InputAmount
                    unitPrice={account.price}
                    currencySymbol={account.user.currency}
                    currencyPrecision={account.wallet.coin.currency_precision}
                    unitPrecision={account.wallet.coin.precision}
                    unitSymbol={account.wallet.coin.symbol}
                    onBlur={onBlur}
                />
            </Form.Item>
        </Stack>
    );
};

const AddressField = ({onBlur}) => {
    const intl = useIntl();
    const account = useActiveWalletAccount();

    if (account.isEmpty()) {
        return null;
    }

    return (
        <Form.Item
            name="address"
            label={intl.formatMessage(messages.address)}
            rules={[{required: true}]}>
            <TextField
                onBlur={onBlur}
                placeholder={intl.formatMessage(messages.addressPlace)}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <ContactsIcon />
                        </InputAdornment>
                    )
                }}
            />
        </Form.Item>
    );
};

export default Send;
