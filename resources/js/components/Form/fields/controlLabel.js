import React, {useContext} from "react";
import {FormInputContext} from "../contexts";
import {FormControl, FormControlLabel, FormHelperText} from "@mui/material";
import {defaultTo, isEmpty} from "lodash";

const ControlLabel = ({children, checked, ...baseProps}) => {
    const {
        isRequired,
        label,
        validateStatus,
        errors = []
    } = useContext(FormInputContext);

    switch (validateStatus) {
        case "error":
            baseProps.error = true;
            break;
        case "success":
            baseProps.color = "primary";
            break;
        default:
            baseProps.color = "info";
    }

    return (
        <FormControl {...baseProps} required={isRequired}>
            <FormControlLabel
                control={children}
                checked={defaultTo(checked, false)}
                label={label}
            />

            {!isEmpty(errors) && (
                <FormHelperText>{errors.join(", ")}</FormHelperText>
            )}
        </FormControl>
    );
};

export default ControlLabel;
