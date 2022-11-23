import React from "react";
import {defineMessages, useIntl} from "react-intl";
import Form, {ControlLabel} from "components/Form";
import {Checkbox} from "@mui/material";

const messages = defineMessages({
    following: {defaultMessage: "Must be a follower"}
});

const FollowerField = () => {
    const intl = useIntl();

    return (
        <Form.Item
            name="following"
            label={intl.formatMessage(messages.following)}
            valuePropName="checked">
            <ControlLabel>
                <Checkbox />
            </ControlLabel>
        </Form.Item>
    );
};

export default FollowerField;
