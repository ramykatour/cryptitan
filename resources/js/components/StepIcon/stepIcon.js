import React from "react";
import {Box} from "@mui/material";
import PropTypes from "prop-types";
import checkmarkFill from "@iconify/icons-eva/checkmark-fill";
import Iconify from "components/Iconify";

const StepIcon = ({active, completed}) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: active ? "primary.main" : "text.disabled",
                zIndex: 9,
                width: 24,
                height: 24
            }}>
            {completed ? (
                <Iconify
                    icon={checkmarkFill}
                    sx={{
                        color: "primary.main",
                        zIndex: 1,
                        width: 20,
                        height: 20
                    }}
                />
            ) : (
                <Box
                    sx={{
                        borderRadius: "50%",
                        backgroundColor: "currentColor",
                        width: 8,
                        height: 8
                    }}
                />
            )}
        </Box>
    );
};

StepIcon.propTypes = {
    completed: PropTypes.bool,
    active: PropTypes.bool
};

export default StepIcon;
