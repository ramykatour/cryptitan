import React, {useCallback, useContext} from "react";
import {Button} from "@mui/material";
import {FormattedMessage} from "react-intl";
import StepContext from "contexts/StepContext";
import {FormContext} from "components/Form/contexts";

const Navigation = () => {
    const {next} = useContext(StepContext);
    const {form} = useContext(FormContext);

    const handleClick = useCallback(() => {
        form.validateFields([
            "type",
            "price_type",
            "account",
            "currency",
            "percent_price",
            "fixed_price"
        ])
            .then(() => next())
            .catch(() => null);
    }, [next, form]);

    return (
        <Button
            size="large"
            variant="contained"
            onClick={handleClick}
            fullWidth>
            <FormattedMessage defaultMessage="Proceed" />
        </Button>
    );
};

export default Navigation;
