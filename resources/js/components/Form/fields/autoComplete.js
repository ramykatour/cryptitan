import React, {useContext} from "react";
import {FormInputContext} from "../contexts";
import {defaultTo, isEmpty} from "lodash";
import {Autocomplete, TextField} from "@mui/material";

const AutoComplete = ({
    value,
    onChange,
    variant = "outlined",
    helperText,
    ...otherProps
}) => {
    const {
        isRequired,
        label,
        validateStatus,
        errors = []
    } = useContext(FormInputContext);

    const controlProps = {variant, label};

    switch (validateStatus) {
        case "error":
            controlProps.error = true;
            break;
        case "success":
            controlProps.color = "primary";
            break;
        default:
            controlProps.color = "info";
    }

    helperText = isEmpty(errors) ? helperText : errors.join(", ");

    return (
        <Autocomplete
            renderInput={(params) => (
                <TextField
                    {...controlProps}
                    helperText={helperText}
                    required={isRequired}
                    {...params}
                />
            )}
            onChange={(e, value) => onChange?.(value)}
            value={defaultTo(value, null)}
            {...otherProps}
        />
    );
};

export default AutoComplete;
