import React, {forwardRef, useCallback, useEffect, useState} from "react";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import QrCodeIcon from "@mui/icons-material/QrCode";
import {Divider, InputAdornment, MenuItem} from "@mui/material";
import Spin from "components/Spin";
import PersonIcon from "@mui/icons-material/Person";
import {useAuth} from "models/Auth";
import {LoadingButton} from "@mui/lab";
import TwoFactorField from "components/TwoFactorField";
import ModalActions from "components/ModalActions";
import ModalContent from "components/ModalContent";

const messages = defineMessages({
    successful: {defaultMessage: "Bank account was added."},
    bank: {defaultMessage: "Select Bank"},
    bankName: {defaultMessage: "Bank Name"},
    beneficiary: {defaultMessage: "Beneficiary"},
    number: {defaultMessage: "Number"},
    note: {defaultMessage: "Note"},
    token: {defaultMessage: "Token"},
    password: {defaultMessage: "Password"}
});

const AddAccount = forwardRef(({closeModal, fetchAccounts}, ref) => {
    const [form] = Form.useForm();
    const auth = useAuth();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const [banks, setBanks] = useState([]);
    const intl = useIntl();

    const fetchBanks = useCallback(() => {
        request
            .get(route("bank.get"))
            .then((data) => setBanks(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("bank.create-account"), values)
                .then(() => {
                    fetchAccounts();
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, fetchAccounts, formRequest]
    );

    const currency = <b>{auth.user.currency}</b>;

    return (
        <Form form={form} onFinish={submitForm}>
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
                            <MenuItem value={"other"}>
                                <FormattedMessage defaultMessage="Other" />
                            </MenuItem>
                        </TextField>
                    </Form.Item>

                    <NameField />

                    <Divider>
                        <FormattedMessage
                            defaultMessage="Account ({currency})"
                            values={{currency: <b>{currency}</b>}}
                        />
                    </Divider>

                    <Form.Item
                        name="beneficiary"
                        label={intl.formatMessage(messages.beneficiary)}
                        initialValue={auth.user.profile?.full_name}>
                        <TextField
                            fullWidth
                            disabled
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
});

const NameField = () => {
    const intl = useIntl();

    const shouldShow = (form) => {
        return form.getFieldValue("bank_id") === "other";
    };

    return (
        <Form.Item shouldUpdate>
            {(form) =>
                shouldShow(form) && (
                    <Form.Item
                        name="bank_name"
                        label={intl.formatMessage(messages.bankName)}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            sx={{mt: 1}}
                        />
                    </Form.Item>
                )
            }
        </Form.Item>
    );
};

export default AddAccount;
