import React from "react";
import SummaryItem from "../SummaryItem";
import {FormattedMessage} from "react-intl";
import Form from "components/Form";

const MinAmount = () => {
    const getContent = (form) => {
        return form.getFieldValue("min_amount");
    };

    const getCurrency = (form) => {
        return form.getFieldValue("currency");
    };

    return (
        <Form.Item shouldUpdate>
            {(form) => (
                <SummaryItem
                    title={
                        <FormattedMessage
                            defaultMessage="Min Amount ({currency})"
                            values={{currency: getCurrency(form)}}
                        />
                    }
                    content={getContent(form)}
                />
            )}
        </Form.Item>
    );
};

export default MinAmount;
