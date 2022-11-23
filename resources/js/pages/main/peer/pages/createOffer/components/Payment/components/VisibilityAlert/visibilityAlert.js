import React from "react";
import {FormattedMessage} from "react-intl";
import Form from "components/Form";
import {Alert} from "@mui/material";

const VisibilityAlert = () => {
    const isTypeSell = (form) => {
        return form.getFieldValue("type") === "sell";
    };

    return (
        <Form.Item shouldUpdate>
            {(form) =>
                isTypeSell(form) && (
                    <Alert severity="info">
                        <FormattedMessage defaultMessage="This offer will only be visible when your available balance is greater than the offer limit." />
                    </Alert>
                )
            }
        </Form.Item>
    );
};

export default VisibilityAlert;
