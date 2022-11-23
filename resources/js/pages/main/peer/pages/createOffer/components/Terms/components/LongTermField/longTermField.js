import React from "react";
import {defineMessages, useIntl} from "react-intl";
import Form, {ControlLabel} from "components/Form";
import {Checkbox} from "@mui/material";

const messages = defineMessages({
    longTerm: {defaultMessage: "Long term users"}
});

const LongTermField = () => {
    const intl = useIntl();

    return (
        <Form.Item
            name="long_term"
            label={intl.formatMessage(messages.longTerm)}
            valuePropName="checked">
            <ControlLabel>
                <Checkbox />
            </ControlLabel>
        </Form.Item>
    );
};

export default LongTermField;
