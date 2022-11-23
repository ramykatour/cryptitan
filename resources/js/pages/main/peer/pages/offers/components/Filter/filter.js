import React, {useCallback, useEffect, useMemo} from "react";
import PropTypes from "prop-types";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Stack
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import Form from "components/Form";
import {useAuth} from "models/Auth";
import CountryField from "./components/CountryField";
import AmountField from "./components/AmountField";
import CurrencyField from "./components/CurrencyField";
import WalletField from "./components/WalletField";
import PaymentSelect from "./components/PaymentSelect";
import PaymentField from "./components/PaymentField";

const Filter = ({apply}) => {
    const [form] = Form.useForm();
    const auth = useAuth();

    useEffect(() => {
        form.submit();
    }, [form]);

    const initialValues = useMemo(
        () => ({
            currency: auth.user.currency,
            country: auth.user.country
        }),
        [auth]
    );

    const applyFilters = useCallback(
        (values) => {
            values.payment_method = values.payment_method?.id;
            return apply(values);
        },
        [apply]
    );

    const reset = useCallback(() => {
        form.resetFields();
        form.submit();
    }, [form]);

    return (
        <Form form={form} initialValues={initialValues} onFinish={applyFilters}>
            <Card>
                <CardHeader
                    title={<FormattedMessage defaultMessage="Filter Offers" />}
                />

                <CardContent>
                    <Stack spacing={3}>
                        <WalletField />
                        <PaymentSelect />
                        <PaymentField />
                        <CurrencyField />
                        <AmountField />
                        <CountryField />
                    </Stack>
                </CardContent>

                <Form.Item shouldUpdate>
                    {(form) => {
                        const touched = form.isFieldsTouched();

                        return (
                            <CardActions>
                                <Button
                                    color="inherit"
                                    variant="outlined"
                                    size="large"
                                    onClick={reset}
                                    disabled={!touched}
                                    fullWidth>
                                    <FormattedMessage defaultMessage="Clear" />
                                </Button>

                                <Button
                                    color="primary"
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    disabled={!touched}
                                    fullWidth>
                                    <FormattedMessage defaultMessage="Apply" />
                                </Button>
                            </CardActions>
                        );
                    }}
                </Form.Item>
            </Card>
        </Form>
    );
};

Filter.propTypes = {
    apply: PropTypes.func.isRequired
};

export default Filter;
