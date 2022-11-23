import React, {useContext} from "react";
import {FormInputContext} from "components/Form/contexts";
import {Input as BaseInput} from "@mui/material";
import {defaultTo} from "lodash";

const Input = ({value, ...baseProps}) => {
    const {isRequired, validateStatus} = useContext(FormInputContext);

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
        <BaseInput
            {...baseProps}
            value={defaultTo(value, "")}
            required={isRequired}
        />
    );
};

export default Input;
