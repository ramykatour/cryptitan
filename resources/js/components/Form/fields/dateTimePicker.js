import React, {useContext} from "react";
import {FormInputContext} from "../contexts";
import {defaultTo, isEmpty} from "lodash";
import BaseDateTimePicker from "@mui/lab/DateTimePicker";
import {dayjs} from "utils/index";
import TextField from "@mui/material/TextField";

const DateTimePicker = ({value, onChange, helperText, ...baseProps}) => {
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
        <BaseDateTimePicker
            onChange={onChange}
            value={defaultTo(value, dayjs())}
            label={label}
            renderInput={(renderParams) => (
                <TextField
                    {...renderParams}
                    {...baseProps}
                    helperText={helperText}
                    required={isRequired}
                />
            )}
        />
    );
};

export default DateTimePicker;
