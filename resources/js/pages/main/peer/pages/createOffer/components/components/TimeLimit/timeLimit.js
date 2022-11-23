import React from "react";
import SummaryItem from "../SummaryItem";
import {FormattedMessage} from "react-intl";
import Form from "components/Form";

const TimeLimit = () => {
    const getContent = (form) => {
        return form.getFieldValue("time_limit");
    };

    return (
        <Form.Item shouldUpdate>
            {(form) => (
                <SummaryItem
                    title={<FormattedMessage defaultMessage="Time Limit" />}
                    content={`${getContent(form) || ""} minutes`}
                />
            )}
        </Form.Item>
    );
};

export default TimeLimit;
