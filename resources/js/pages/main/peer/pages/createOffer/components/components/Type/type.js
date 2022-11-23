import React from "react";
import {FormattedMessage} from "react-intl";
import Form from "components/Form";
import SummaryItem from "../SummaryItem";

const Type = () => {
    const getContent = (form) => {
        switch (form.getFieldValue("type")) {
            case "sell":
                return <FormattedMessage defaultMessage="Sell" />;
            case "buy":
                return <FormattedMessage defaultMessage="Buy" />;
        }
    };

    return (
        <Form.Item shouldUpdate>
            {(form) => (
                <SummaryItem
                    title={<FormattedMessage defaultMessage="Offer Type" />}
                    content={getContent(form)}
                />
            )}
        </Form.Item>
    );
};

export default Type;
