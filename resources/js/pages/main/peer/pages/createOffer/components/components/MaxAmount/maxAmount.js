import React from "react";
import Form from "components/Form";
import SummaryItem from "../SummaryItem";
import {FormattedMessage} from "react-intl";

const MaxAmount = () => {
    const getContent = (form) => {
        return form.getFieldValue("max_amount");
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
                            defaultMessage="Max Amount ({currency})"
                            values={{currency: getCurrency(form)}}
                        />
                    }
                    content={getContent(form)}
                />
            )}
        </Form.Item>
    );
};

export default MaxAmount;
