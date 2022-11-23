import React, {useCallback, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import {
    Alert,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    InputAdornment,
    Stack,
    Typography
} from "@mui/material";
import {isEmpty} from "lodash";
import Result from "components/Result";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    updated: {defaultMessage: "P2P fee was updated."},
    buy: {defaultMessage: "Buy"},
    sell: {defaultMessage: "Sell"}
});

const PeerTradeFee = () => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [data, setData] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchData = useCallback(() => {
        request
            .get(route("admin.wallet.get-peer-fees"))
            .then((data) => setData(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.wallet.update-peer-fees"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.updated));
                    fetchData();
                })
                .catch(errorHandler());
        },
        [intl, formRequest, fetchData]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Card>
                <CardHeader
                    title={<FormattedMessage defaultMessage="P2P Trade Fees" />}
                />

                <CardContent>
                    <Spin spinning={loading}>
                        {!isEmpty(data) ? (
                            <Stack spacing={3}>
                                <Alert severity="info">
                                    <FormattedMessage
                                        defaultMessage="This is credited to the {operator}'s account, the operator can be set in modules' configuration."
                                        values={{operator: <b>Operator</b>}}
                                    />
                                </Alert>

                                {data.map((wallet) => (
                                    <WalletFields
                                        key={wallet.id}
                                        wallet={wallet}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Result
                                title={
                                    <FormattedMessage defaultMessage="No wallets yet." />
                                }
                                description={
                                    <FormattedMessage defaultMessage="You have not added any wallet." />
                                }
                            />
                        )}
                    </Spin>
                </CardContent>

                {!isEmpty(data) && (
                    <CardActions sx={{justifyContent: "flex-end"}}>
                        <LoadingButton
                            variant="contained"
                            type="submit"
                            loading={formLoading}>
                            <FormattedMessage defaultMessage="Save Changes" />
                        </LoadingButton>
                    </CardActions>
                )}
            </Card>
        </Form>
    );
};

const WalletFields = ({wallet}) => {
    const id = wallet.coin.identifier;
    const intl = useIntl();

    const sellFee = wallet.peer_fees.find((o) => {
        return o.category === "sell";
    });

    const buyFee = wallet.peer_fees.find((o) => {
        return o.category === "buy";
    });

    return (
        <Stack spacing={2}>
            <Typography variant="overline">{wallet.coin.name}</Typography>

            <Stack spacing={2} direction="row">
                <Form.Item
                    name={["fees", id, "buy"]}
                    label={intl.formatMessage(messages.buy)}
                    initialValue={buyFee?.value || 0}
                    rules={[{required: true}]}>
                    <InputField />
                </Form.Item>

                <Form.Item
                    name={["fees", id, "sell"]}
                    label={intl.formatMessage(messages.sell)}
                    initialValue={sellFee?.value || 0}
                    rules={[{required: true}]}>
                    <InputField />
                </Form.Item>
            </Stack>
        </Stack>
    );
};

const InputField = (props) => {
    return (
        <TextField
            type="number"
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <FormattedMessage defaultMessage="Percent" />
                    </InputAdornment>
                )
            }}
            {...props}
        />
    );
};

export default PeerTradeFee;
