import React, {useCallback, useContext, useMemo} from "react";
import {isEmpty} from "lodash";
import {Box, Grid, InputAdornment} from "@mui/material";
import Form, {TextField} from "components/Form";
import PeerOfferContext from "contexts/PeerOfferContext";
import Value from "utils/classes/Value";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
    price: {defaultMessage: "Enter Amount"},
    value: {defaultMessage: "Enter Value"}
});

const AmountField = () => {
    const intl = useIntl();
    const {offer} = useContext(PeerOfferContext);

    const rules = useMemo(
        () => [
            Value.validate(intl),
            Value.validateMin(intl, offer.min_value),
            Value.validateMax(intl, offer.max_value),
            {required: true}
        ],
        [intl, offer]
    );

    return (
        <Box component="div">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Form.Item
                        name="amount"
                        label={intl.formatMessage(messages.price)}
                        rules={rules}>
                        <InputPrice />
                    </Form.Item>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Form.Item
                        name="amount"
                        label={intl.formatMessage(messages.value)}
                        rules={rules}>
                        <InputValue />
                    </Form.Item>
                </Grid>
            </Grid>
        </Box>
    );
};

const InputPrice = ({value, onChange, onBlur}) => {
    const {offer} = useContext(PeerOfferContext);

    const content = useMemo(() => {
        return value?.scale === "price" ? value.amount : value?.priceValue;
    }, [value]);

    const updateAmount = useCallback(
        (e) => {
            return onChange?.(value?.clone(e.target.value, "price"));
        },
        [value, onChange]
    );

    return (
        <TextField
            fullWidth
            disabled={isEmpty(value) || !offer.tradable}
            value={content}
            onChange={updateAmount}
            InputLabelProps={{shrink: true}}
            type="number"
            onBlur={onBlur}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {offer.currency}
                    </InputAdornment>
                )
            }}
        />
    );
};

const InputValue = ({value, onChange, onBlur}) => {
    const {offer} = useContext(PeerOfferContext);

    const content = useMemo(() => {
        return value?.scale === "unit" ? value.amount : value?.unitValue;
    }, [value]);

    const updateAmount = useCallback(
        (e) => {
            return onChange?.(value?.clone(e.target.value, "unit"));
        },
        [value, onChange]
    );

    return (
        <TextField
            fullWidth
            value={content}
            disabled={isEmpty(value) || !offer.tradable}
            onChange={updateAmount}
            InputLabelProps={{shrink: true}}
            type="number"
            onBlur={onBlur}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {offer.coin.symbol}
                    </InputAdornment>
                )
            }}
        />
    );
};

export default AmountField;
