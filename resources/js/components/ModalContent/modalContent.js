import React from "react";
import {Stack} from "@mui/material";

const ModalContent = ({sx, ...otherProps}) => {
    return <Stack sx={{pb: 1, ...sx}} {...otherProps} />;
};

export default ModalContent;
