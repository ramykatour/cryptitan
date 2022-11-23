import React, {useContext} from "react";
import {TextField as BaseTextField} from "@mui/material";
import {FormInputContext} from "../contexts";
import {defaultTo, isEmpty} from "lodash";

const TextField = ({value, helperText, ...baseProps}) => {
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
    helperText = isEmpty(errors) ? helperText : errors.join(", ");

    return (
        <BaseTextField
            {...baseProps}
            label={label}
            helperText={helperText}
            value={defaultTo(value, "")}
            required={isRequired}
        />
    );
};

export default TextField;
