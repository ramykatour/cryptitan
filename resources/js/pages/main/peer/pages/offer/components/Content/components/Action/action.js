import React, {useCallback, useContext, useMemo} from "react";
import Form from "components/Form";
import PeerOfferContext from "contexts/PeerOfferContext";
import Value from "utils/classes/Value";
import {Card, CardActions, CardContent, Stack} from "@mui/material";
import StatusAlert from "./components/StatusAlert";
import AmountField from "./components/AmountField";
import ActionButton from "./components/ActionButton";
import {LoadingProvider} from "contexts/LoadingContext";
import PaymentField from "./components/PaymentField";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import {defineMessages, useIntl} from "react-intl";
import router from "router/router";
import {useNavigate} from "react-router-dom";
import {tap} from "lodash";

const messages = defineMessages({
    success: {defaultMessage: "Your trade has started."}
});

const Action = () => {
    const [form] = Form.useForm();
    const [request, loading] = useFormRequest(form);
    const {offer} = useContext(PeerOfferContext);
    const navigate = useNavigate();
    const intl = useIntl();

    const submitForm = useCallback(
        (values) => {
            const url = route("peer-offer.start-trade", {offer: offer.id});

            request
                .post(url, normalize(values))
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    navigate(router.generatePath("main.peer.trades"));
                })
                .catch(errorHandler());
        },
        [request, intl, navigate, offer]
    );

    const initialAmount = useMemo(() => {
        return new Value(
            0,
            "unit",
            offer.price,
            offer.coin.precision,
            offer.coin.currency_precision
        );
    }, [offer]);

    return (
        <Form
            form={form}
            initialValues={{amount: initialAmount}}
            onFinish={submitForm}>
            <LoadingProvider loading={loading}>
                <Card>
                    <CardContent>
                        <Stack spacing={3}>
                            <AmountField />
                            <PaymentField />
                            <StatusAlert />
                        </Stack>
                    </CardContent>

                    <CardActions>
                        <ActionButton />
                    </CardActions>
                </Card>
            </LoadingProvider>
        </Form>
    );
};

const normalize = (values) => {
    return tap(values, (values) => {
        values.bank_account = values.bank_account?.id;
        values.amount = Number(values.amount);
    });
};

export default Action;
