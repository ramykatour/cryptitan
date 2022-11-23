import React from "react";
import Form, {ControlLabel} from "components/Form";
import {Checkbox} from "@mui/material";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
    verification: {defaultMessage: "Completed KYC"}
});

const VerificationField = () => {
    const intl = useIntl();

    return (
        <Form.Item
            name="verification"
            label={intl.formatMessage(messages.verification)}
            valuePropName="checked">
            <ControlLabel>
                <Checkbox />
            </ControlLabel>
        </Form.Item>
    );
};

export default VerificationField;
