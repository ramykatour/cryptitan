import React from "react";
import {useTokenField} from "hooks/user";
import {useActiveWalletAccount} from "hooks/account";
import {Stack} from "@mui/material";
import Form from "components/Form";
import Alert from "components/Alert";
import {FormattedMessage} from "react-intl";

const Information = ({getDeductible}) => {
    const account = useActiveWalletAccount();
    const tokenField = useTokenField();

    const getTokenErrors = (form) => {
        return form.getFieldError(tokenField);
    };

    const isInsufficient = (form) => {
        return (
            Number(form.getFieldValue("amount")) > 0 &&
            account.available < getDeductible()
        );
    };

    if (account.isEmpty()) {
        return null;
    }

    return (
        <Stack spacing={2}>
            <Form.Item shouldUpdate>
                {(form) =>
                    getTokenErrors(form).map((error, i) => (
                        <Alert key={i} severity="error">
                            <span>{error}</span>
                        </Alert>
                    ))
                }
            </Form.Item>

            <Form.Item shouldUpdate>
                {(form) =>
                    isInsufficient(form) && (
                        <Alert severity="error">
                            <FormattedMessage
                                defaultMessage="You don't have enough {coin} to send."
                                values={{coin: <b>{account.coin.name}</b>}}
                            />
                        </Alert>
                    )
                }
            </Form.Item>
        </Stack>
    );
};

export default Information;
