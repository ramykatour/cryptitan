import React, {useCallback, useContext} from "react";
import {FormattedMessage} from "react-intl";
import {Button, Stack} from "@mui/material";
import StepContext from "contexts/StepContext";
import {FormContext} from "components/Form/contexts";

const Navigation = () => {
    const {form} = useContext(FormContext);
    const {next, prev} = useContext(StepContext);

    const handleClick = useCallback(() => {
        form.validateFields([
            "min_amount",
            "max_amount",
            "payment",
            "payment_method",
            "bank_account",
            "time_limit"
        ])
            .then(() => next())
            .catch(() => null);
    }, [next, form]);

    return (
        <Stack direction="row" spacing={2}>
            <Button
                size="large"
                variant="outlined"
                color="inherit"
                onClick={prev}
                fullWidth>
                <FormattedMessage defaultMessage="Return" />
            </Button>

            <Button
                size="large"
                variant="contained"
                onClick={handleClick}
                fullWidth>
                <FormattedMessage defaultMessage="Proceed" />
            </Button>
        </Stack>
    );
};

export default Navigation;
