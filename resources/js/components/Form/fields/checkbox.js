import React from "react";
import {Checkbox as BaseCheckbox} from "@mui/material";
import {defaultTo} from "lodash";

const Checkbox = ({checked, ...props}) => {
    return <BaseCheckbox checked={defaultTo(checked, false)} {...props} />;
};

export default Checkbox;
