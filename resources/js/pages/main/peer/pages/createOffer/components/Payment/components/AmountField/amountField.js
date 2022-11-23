import React from "react";
import {Box, Grid, InputAdornment} from "@mui/material";
import Form, {TextField} from "components/Form";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
    minAmount: {defaultMessage: "Min Amount"},
    maxAmount: {defaultMessage: "Max Amount"},
    maxRule: {defaultMessage: "must be greater than minimum value."}
});

const AmountField = () => {
    return (
        <Box component="div">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <MinAmount />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <MaxAmount />
                </Grid>
            </Grid>
        </Box>
    );
};

const MinAmount = () => {
    const intl = useIntl();

    const getCurrency = (form) => {
        return form.getFieldValue("currency");
    };

    const shouldUpdate = (previous, current) =>
        current.currency !== previous.currency;

    return (
        <Form.Item shouldUpdate={shouldUpdate}>
            {(form) => (
                <Form.Item
                    name="min_amount"
                    label={intl.formatMessage(messages.minAmount)}
                    rules={[{required: true, type: "number", min: 1}]}
                    normalize={(v) => v && parseFloat(v)}>
                    <TextField
                        type="number"
                        InputLabelProps={{shrink: true}}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {getCurrency(form)}
                                </InputAdornment>
                            )
                        }}
                    />
                </Form.Item>
            )}
        </Form.Item>
    );
};

const MaxAmount = () => {
    const intl = useIntl();

    const getCurrency = (form) => {
        return form.getFieldValue("currency");
    };

    const shouldUpdate = (previous, current) =>
        current.currency !== previous.currency;

    const maxRule = ({getFieldValue}) => ({
        validator(rule, value) {
            const message = intl.formatMessage(messages.maxRule);

            if (getFieldValue("min_amount") < value) {
                return Promise.resolve();
            } else {
                return Promise.reject(message);
            }
        }
    });

    return (
        <Form.Item shouldUpdate={shouldUpdate}>
            {(form) => (
                <Form.Item
                    name="max_amount"
                    dependencies={["min_amount"]}
                    label={intl.formatMessage(messages.maxAmount)}
                    rules={[{required: true, type: "number"}, maxRule]}
                    normalize={(v) => v && parseFloat(v)}>
                    <TextField
                        type="number"
                        InputLabelProps={{shrink: true}}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {getCurrency(form)}
                                </InputAdornment>
                            )
                        }}
                    />
                </Form.Item>
            )}
        </Form.Item>
    );
};

export default AmountField;
