import React, {useCallback, useContext, useMemo} from "react";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Box, Stack, Typography} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {Rating, TextField} from "components/Form";
import {LoadingButton} from "@mui/lab";
import PeerTradeContext from "contexts/PeerTradeContext";
import {errorHandler, route, useFormRequest} from "services/Http";
import {isEmpty} from "lodash";
import {notify} from "utils/index";

const messages = defineMessages({
    comment: {defaultMessage: "Comment"},
    success: {defaultMessage: "Rating was submitted."},
    rating: {defaultMessage: "Rating"}
});

const TradeRating = () => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const {trade, fetchTrade} = useContext(PeerTradeContext);
    const [request, loading] = useFormRequest(form);

    const rating = useMemo(() => {
        if (trade.role === "buyer") {
            return trade.seller_rating;
        } else {
            return trade.buyer_rating;
        }
    }, [trade]);

    const url = useMemo(() => {
        if (trade.role === "buyer") {
            return route("peer-trade.rate-seller", {trade: trade.id});
        } else {
            return route("peer-trade.rate-buyer", {trade: trade.id});
        }
    }, [trade]);

    const submitForm = useCallback(
        (values) => {
            request
                .post(url, values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    fetchTrade();
                })
                .catch(errorHandler());
        },
        [request, url, intl, fetchTrade]
    );

    if (!trade.isPersonal()) {
        return null;
    }

    return (
        <Container>
            <Form form={form} onFinish={submitForm}>
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Typography variant="body2">
                            {trade.role === "buyer" ? (
                                <FormattedMessage defaultMessage="Rate Seller:" />
                            ) : (
                                <FormattedMessage defaultMessage="Rate Buyer:" />
                            )}
                        </Typography>

                        <Form.Item
                            name="value"
                            initialValue={rating?.value}
                            label={intl.formatMessage(messages.rating)}
                            rules={[{required: true}]}>
                            <Rating size="medium" />
                        </Form.Item>
                    </Stack>

                    <Form.Item
                        name="comment"
                        initialValue={rating?.comment}
                        label={intl.formatMessage(messages.comment)}
                        rules={[{required: true}]}>
                        <TextField fullWidth multiline maxRows={5} />
                    </Form.Item>

                    <Stack direction="row">
                        <LoadingButton
                            loading={loading}
                            variant="contained"
                            type="submit">
                            {isEmpty(rating) ? (
                                <FormattedMessage defaultMessage="Submit Review" />
                            ) : (
                                <FormattedMessage defaultMessage="Update Review" />
                            )}
                        </LoadingButton>
                    </Stack>
                </Stack>
            </Form>
        </Container>
    );
};

const Container = styled(Box)(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: theme.spacing(3),
    flexGrow: 1,
    height: "100%"
}));

export default TradeRating;
