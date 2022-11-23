import React, {useContext} from "react";
import {FormattedMessage} from "react-intl";
import {LoadingButton} from "@mui/lab";
import StepContext from "contexts/StepContext";
import {Button, Stack} from "@mui/material";

const Navigation = () => {
    const {prev, loading} = useContext(StepContext);

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

            <LoadingButton
                size="large"
                variant="contained"
                type="submit"
                loading={loading}
                fullWidth>
                <FormattedMessage defaultMessage="Submit" />
            </LoadingButton>
        </Stack>
    );
};

export default Navigation;
