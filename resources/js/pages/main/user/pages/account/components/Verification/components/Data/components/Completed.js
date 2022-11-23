import React from "react";
import {SuccessIllustration} from "assets/index";
import {Box} from "@mui/material";
import {FormattedMessage} from "react-intl";
import Result from "components/Result";

const Completed = (props) => {
    return (
        <Box {...props}>
            <Result
                title={
                    <FormattedMessage defaultMessage="Verification complete." />
                }
                description={
                    <FormattedMessage defaultMessage="There are no further requirements for now." />
                }
                icon={SuccessIllustration}
                iconSize={130}
            />
        </Box>
    );
};

export default Completed;
