import React from "react";
import {toLower} from "lodash";
import {Box} from "@mui/material";

const FlagIcon = ({code, ...otherProps}) => {
    return (
        <Box
            {...otherProps}
            className={`flag-icon flag-icon-${toLower(code)}`}
            component="span"
        />
    );
};

export default FlagIcon;
