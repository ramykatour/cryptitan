import React, {useCallback, useMemo, useState} from "react";
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Stack,
    Typography
} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {LoadingButton} from "@mui/lab";
import {round} from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {
    clearCartItems,
    selectCartItems,
    updateCartItems
} from "redux/slices/giftcards";
import {useAuth} from "models/Auth";
import Form from "components/Form";
import {usePaymentAccount} from "hooks/account";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import {fetchPaymentAccount} from "redux/slices/payment";
import Complete from "./Complete";
import TwoFactorField from "components/TwoFactorField";

const messages = defineMessages({
    password: {defaultMessage: "Password"},
    success: {defaultMessage: "Your purchase was successful."},
    token: {defaultMessage: "Token"}
});

const Summary = () => {
    const [form] = Form.useForm();
    const auth = useAuth();
    const intl = useIntl();
    const [complete, setComplete] = useState(false);
    const dispatch = useDispatch();
    const [formRequest, formLoading] = useFormRequest(form);
    const {account} = usePaymentAccount();
    const cartItems = useSelector(selectCartItems);
    const currency = auth.user.currency;

    const total = cartItems.reduce((total, item) => {
        const quantity = Math.min(item.quantity, item.stock);
        return round(total + quantity * item.price, 2);
    }, 0);

    const submitForm = useCallback(
        (values) => {
            values.items = cartItems.map((item) => {
                const quantity = Math.min(item.quantity, item.stock);
                return {id: item.id, quantity};
            });

            formRequest
                .post(route("giftcard.purchase"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    form.resetFields();
                    dispatch(fetchPaymentAccount());
                    dispatch(clearCartItems());
                    setComplete(true);
                })
                .catch(
                    errorHandler(() => {
                        dispatch(updateCartItems());
                    })
                );
        },
        [intl, cartItems, formRequest, dispatch, form]
    );

    const allowSubmit = useMemo(() => {
        return total > 0 && total <= account.available;
    }, [total, account]);

    return (
        <Form form={form} onFinish={submitForm}>
            <Card sx={{mb: 3}}>
                <CardHeader
                    title={<FormattedMessage defaultMessage="Order Summary" />}
                />

                <CardContent>
                    <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography
                                sx={{color: "text.secondary"}}
                                variant="body2">
                                <FormattedMessage defaultMessage="Sub Total" />
                            </Typography>

                            <Typography
                                sx={{color: "text.secondary"}}
                                variant="subtitle2">
                                {total}
                            </Typography>
                        </Stack>

                        <Divider />

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">
                                <FormattedMessage defaultMessage="Available" />
                            </Typography>

                            <Typography
                                sx={{color: "text.secondary"}}
                                variant="subtitle2">
                                {account.formatted_available}
                            </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1">
                                <FormattedMessage defaultMessage="Total" />
                            </Typography>

                            <Box sx={{textAlign: "right"}}>
                                <Typography
                                    sx={{color: "primary.main"}}
                                    variant="h5">
                                    {total}
                                </Typography>

                                <Typography
                                    sx={{fontStyle: "italic"}}
                                    variant="caption">
                                    <FormattedMessage
                                        defaultMessage="(prices are in {currency})"
                                        values={{currency: <b>{currency}</b>}}
                                    />
                                </Typography>
                            </Box>
                        </Stack>

                        <TwoFactorField />
                    </Stack>

                    {complete && <Complete />}
                </CardContent>

                <CardActions>
                    <LoadingButton
                        size="large"
                        startIcon={<ShoppingCartIcon />}
                        type="submit"
                        variant="contained"
                        disabled={!allowSubmit}
                        loading={formLoading}
                        fullWidth>
                        <FormattedMessage defaultMessage="Buy Now" />
                    </LoadingButton>
                </CardActions>
            </Card>
        </Form>
    );
};

export default Summary;
