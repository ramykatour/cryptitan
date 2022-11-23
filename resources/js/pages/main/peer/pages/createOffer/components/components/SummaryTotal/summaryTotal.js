import React from "react";
import PropTypes from "prop-types";
import {Stack, Typography} from "@mui/material";

const SummaryTotal = ({title, content}) => {
    return (
        <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">{title}</Typography>
            <Typography variant="subtitle1">{content}</Typography>
        </Stack>
    );
};

SummaryTotal.propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

export default SummaryTotal;
