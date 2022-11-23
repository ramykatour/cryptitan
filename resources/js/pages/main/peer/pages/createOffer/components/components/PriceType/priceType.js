import React from "react";
import Form from "components/Form";
import SummaryItem from "../SummaryItem";
import {FormattedMessage} from "react-intl";

const PriceType = () => {
    const getContent = (form) => {
        switch (form.getFieldValue("price_type")) {
            case "percent":
                return <FormattedMessage defaultMessage="Percent" />;
            case "fixed":
                return <FormattedMessage defaultMessage="Fixed" />;
        }
    };

    return (
        <Form.Item shouldUpdate>
            {(form) => (
                <SummaryItem
                    title={<FormattedMessage defaultMessage="Price Type" />}
                    content={getContent(form)}
                />
            )}
        </Form.Item>
    );
};

export default PriceType;
