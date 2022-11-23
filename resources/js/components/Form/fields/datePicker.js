import React, {useContext} from "react";
import TextField from "@mui/material/TextField";
import {FormInputContext} from "../contexts";
import BaseDatePicker from "@mui/lab/DatePicker";
import {defaultTo, isEmpty} from "lodash";
import {dayjs} from "utils/index";

const DatePicker = ({
    inputFormat = "L",
    value,
    onChange,
    helperText,
    ...baseProps
}) => {
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
        <BaseDatePicker
            inputFormat={inputFormat}
            label={label}
            onChange={onChange}
            value={defaultTo(value, dayjs())}
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

export default DatePicker;
