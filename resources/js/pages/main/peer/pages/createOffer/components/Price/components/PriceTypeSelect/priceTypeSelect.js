import React from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {ToggleButtonGroup} from "components/Form";
import {ToggleButton} from "@mui/material";

const messages = defineMessages({
    priceType: {defaultMessage: "Price Type"}
});

const PriceTypeSelect = () => {
    const intl = useIntl();

    return (
        <Form.Item
            name="price_type"
            label={intl.formatMessage(messages.priceType)}
            rules={[{required: true}]}>
            <ToggleButtonGroup exclusive fullWidth size="small">
                <ToggleButton value="fixed">
                    <FormattedMessage defaultMessage="Fixed" />
                </ToggleButton>

                <ToggleButton value="percent">
                    <FormattedMessage defaultMessage="Percent" />
                </ToggleButton>
            </ToggleButtonGroup>
        </Form.Item>
    );
};

export default PriceTypeSelect;
