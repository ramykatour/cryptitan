import React, {Fragment, useCallback, useMemo} from "react";
import {useActiveWalletAccount} from "hooks/account";
import Form, {TextField} from "components/Form";
import IconBuilder from "components/IconBuilder";
import {InputAdornment, Stack} from "@mui/material";
import {isEmpty, isNumber} from "lodash";
import {FormattedMessage} from "react-intl";

const InputValue = ({value, onChange, onBlur, fee}) => {
    const account = useActiveWalletAccount();

    const updateAmount = useCallback(
        (e) => {
            return onChange?.(value?.clone(e.target.value, "unit"));
        },
        [value, onChange]
    );

    const helperText = account.isNotEmpty() ? (
        <Stack
            component="span"
            divider={<span>&bull;</span>}
            direction="row"
            spacing={1}>
            <span>
                <FormattedMessage
                    defaultMessage="Available: {available}"
                    values={{available: account.available}}
                />
            </span>

            {isNumber(fee) && (
                <span>
                    <FormattedMessage
                        defaultMessage="Fee: {fee}"
                        values={{fee}}
                    />
                </span>
            )}
        </Stack>
    ) : (
        <FormattedMessage defaultMessage="select account..." />
    );

    const content = useMemo(() => {
        return value?.scale === "unit" ? value.amount : value?.unitValue;
    }, [value]);

    return (
        <Fragment>
            <TextField
                fullWidth={true}
                value={content}
                disabled={isEmpty(value)}
                onChange={updateAmount}
                InputLabelProps={{shrink: true}}
                helperText={helperText}
                type="number"
                onBlur={onBlur}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {account.isNotEmpty() && (
                                <IconBuilder
                                    icon={account.wallet.coin.svgIcon()}
                                    sx={{fontSize: "25px"}}
                                />
                            )}
                        </InputAdornment>
                    )
                }}
            />

            <Form.Item name="account">
                <TextField sx={{display: "none"}} />
            </Form.Item>
        </Fragment>
    );
};

export default InputValue;
