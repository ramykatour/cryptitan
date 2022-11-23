import React from "react";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Select as BaseSelect} from "@mui/material";
import {defaultTo} from "lodash";

const SelectAdornment = ({value, ...props}) => {
    return <StyledSelect value={defaultTo(value, "")} {...props} />;
};

const StyledSelect = styled(BaseSelect)({
    "& .MuiOutlinedInput-notchedOutline": {border: "none !important"},
    "& .MuiSvgIcon-root": {right: 0}
});

export default SelectAdornment;
