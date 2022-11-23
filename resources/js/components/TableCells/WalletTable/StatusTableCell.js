import React from "react";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

const StatusTableCell = ({transaction}) => {
    const completed = transaction.confirmed;

    switch (transaction.type) {
        case "receive":
            return (
                <ArrowCircleDownIcon
                    color={completed ? "success" : "disabled"}
                    fontSize="large"
                />
            );
        case "send":
            return (
                <ArrowCircleUpIcon
                    color={completed ? "error" : "disabled"}
                    fontSize="large"
                />
            );
    }
};

export default StatusTableCell;
