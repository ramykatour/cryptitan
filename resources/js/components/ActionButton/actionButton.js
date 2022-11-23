import React, {forwardRef} from "react";
import {alpha, useTheme} from "@mui/material/styles";
import {IconButton} from "@mui/material";

const ActionButton = forwardRef(({sx, active, ...otherProps}, ref) => {
    const theme = useTheme();

    return (
        <IconButton
            ref={ref}
            color={active ? "primary" : "default"}
            {...otherProps}
            sx={{
                ...(active && {
                    bgcolor: alpha(
                        theme.palette.primary.main,
                        theme.palette.action.focusOpacity
                    )
                }),
                ...sx
            }}
        />
    );
});

export default ActionButton;
