import React, {useCallback, useContext} from "react";
import {FormControl, FormHelperText, Rating as BaseRating} from "@mui/material";
import {defaultTo, isEmpty} from "lodash";
import {FormInputContext} from "components/Form/contexts";

const Rating = ({value, onChange, ...baseProps}) => {
    const {
        isRequired,
        validateStatus,
        errors = []
    } = useContext(FormInputContext);

    const control = {required: isRequired};

    switch (validateStatus) {
        case "error":
            control.error = true;
            break;
        case "success":
            control.color = "primary";
            break;
        default:
            control.color = "info";
    }

    const trigger = useCallback(
        (e, v) => onChange?.(defaultTo(v, value)),
        [value, onChange]
    );

    return (
        <FormControl {...control}>
            <BaseRating
                onChange={trigger}
                value={defaultTo(value, null)}
                {...baseProps}
            />

            {!isEmpty(errors) && (
                <FormHelperText>{errors.join(", ")}</FormHelperText>
            )}
        </FormControl>
    );
};

export default Rating;
