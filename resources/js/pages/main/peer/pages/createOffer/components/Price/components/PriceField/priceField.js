import React from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {TextField} from "components/Form";
import {InputAdornment} from "@mui/material";

const messages = defineMessages({
    fixedPrice: {defaultMessage: "Fixed Price"},
    percentPrice: {defaultMessage: "Price Margin"}
});

const PriceField = () => {
    const intl = useIntl();

    const getPriceType = (form) => {
        return form.getFieldValue("price_type");
    };

    const getCurrency = (form) => {
        return form.getFieldValue("currency");
    };

    const shouldUpdate = (previous, current) =>
        current.price_type !== previous.price_type ||
        current.currency !== previous.currency;

    return (
        <Form.Item shouldUpdate={shouldUpdate}>
            {(form) =>
                getPriceType(form) === "percent" ? (
                    <Form.Item
                        name="percent_price"
                        label={intl.formatMessage(messages.percentPrice)}
                        rules={[{required: true, type: "number", min: 1}]}
                        normalize={(v) => v && parseFloat(v)}
                        initialValue={100}>
                        <TextField
                            type="number"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <FormattedMessage defaultMessage="%" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>
                ) : (
                    <Form.Item
                        name="fixed_price"
                        label={intl.formatMessage(messages.fixedPrice)}
                        rules={[{required: true, type: "number"}]}
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
                )
            }
        </Form.Item>
    );
};

export default PriceField;
