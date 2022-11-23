import React from "react";
import Form, {TextField} from "components/Form";
import {defineMessages, useIntl} from "react-intl";
import {MenuItem} from "@mui/material";

const range = [15, 30, 45, 60];

const messages = defineMessages({
    timeLimit: {defaultMessage: "Time Limit"}
});

const TimeLimitField = () => {
    const intl = useIntl();

    return (
        <Form.Item
            name="time_limit"
            label={intl.formatMessage(messages.timeLimit)}
            rules={[{required: true, type: "number"}]}>
            <TextField fullWidth select>
                {range.map((value, key) => (
                    <MenuItem value={value} key={key}>
                        {`${value} minutes`}
                    </MenuItem>
                ))}
            </TextField>
        </Form.Item>
    );
};

export default TimeLimitField;
