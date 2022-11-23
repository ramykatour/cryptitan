import React from "react";
import PropTypes from "prop-types";
import {m, AnimatePresence} from "framer-motion";
import {Dialog, Box, Paper} from "@mui/material";
import {varFade} from "./variants";

function DialogAnimate({open = false, onClose, children, sx, ...other}) {
    return (
        <AnimatePresence>
            {open && (
                <Dialog
                    fullWidth
                    maxWidth="xs"
                    open={open}
                    onClose={onClose}
                    PaperComponent={(props) => (
                        <Box
                            component={m.div}
                            {...varFade({
                                durationIn: 0.32,
                                durationOut: 0.24,
                                easeIn: "easeInOut",
                                distance: 120
                            }).inUp}
                            sx={{
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                            <Box
                                onClick={onClose}
                                sx={{
                                    height: "100%",
                                    width: "100%",
                                    position: "fixed"
                                }}
                            />

                            <Paper sx={sx} {...props}>
                                {props.children}
                            </Paper>
                        </Box>
                    )}
                    {...other}>
                    {children}
                </Dialog>
            )}
        </AnimatePresence>
    );
}

DialogAnimate.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    children: PropTypes.node.isRequired,
    sx: PropTypes.object
};

export default DialogAnimate;
