import React from "react";
import PropTypes from "prop-types";
import {m} from "framer-motion";
import {Box} from "@mui/material";
import {varContainer} from "./variants";

function MotionContainer({animate, action = false, children, ...other}) {
    if (action) {
        return (
            <Box
                component={m.div}
                initial={false}
                animate={animate ? "animate" : "exit"}
                variants={varContainer()}
                {...other}>
                {children}
            </Box>
        );
    }

    return (
        <Box
            component={m.div}
            exit="exit"
            initial="initial"
            animate="animate"
            variants={varContainer()}
            {...other}>
            {children}
        </Box>
    );
}

MotionContainer.propTypes = {
    action: PropTypes.bool,
    animate: PropTypes.bool,
    children: PropTypes.node.isRequired
};

export default MotionContainer;
