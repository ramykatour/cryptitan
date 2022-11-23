import React from "react";
import {Chip} from "@mui/material";
import {FormattedMessage} from "react-intl";

const StatusTableCell = ({status}) => {
    switch (status) {
        case "pending":
            return (
                <Chip
                    size="small"
                    color="info"
                    label={<FormattedMessage defaultMessage="Pending" />}
                />
            );
        case "approved":
            return (
                <Chip
                    size="small"
                    color="success"
                    label={<FormattedMessage defaultMessage="Approved" />}
                />
            );
        case "rejected":
            return (
                <Chip
                    size="small"
                    color="error"
                    label={<FormattedMessage defaultMessage="Rejected" />}
                />
            );
        default:
            return null;
    }
};

export default StatusTableCell;
