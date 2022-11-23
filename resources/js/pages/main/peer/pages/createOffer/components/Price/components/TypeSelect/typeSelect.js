import React from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {ToggleButtonGroup} from "components/Form";
import {ToggleButton} from "@mui/material";

const messages = defineMessages({
    type: {defaultMessage: "Type"}
});

const TypeSelect = () => {
    const intl = useIntl();

    return (
        <Form.Item
            name="type"
            label={intl.formatMessage(messages.type)}
            rules={[{required: true}]}>
            <ToggleButtonGroup exclusive fullWidth>
                <ToggleButton value="buy">
                    <FormattedMessage defaultMessage="BUY" />
                </ToggleButton>

                <ToggleButton value="sell">
                    <FormattedMessage defaultMessage="SELL" />
                </ToggleButton>
            </ToggleButtonGroup>
        </Form.Item>
    );
};

export default TypeSelect;
