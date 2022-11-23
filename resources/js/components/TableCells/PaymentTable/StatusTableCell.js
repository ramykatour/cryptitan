import React from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

const StatusTableCell = ({transaction}) => {
    if (transaction.status === "canceled") {
        return <HighlightOffIcon color="disabled" fontSize="large" />;
    }

    const completed = transaction.status === "completed";

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
