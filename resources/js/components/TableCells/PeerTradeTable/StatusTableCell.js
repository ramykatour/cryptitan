import React, {useMemo} from "react";
import Label from "components/Label";
import {FormattedMessage} from "react-intl";

const StatusTableCell = ({status}) => {
    return useMemo(() => {
        switch (status) {
            case "active":
                return (
                    <Label variant="ghost" color="info">
                        <FormattedMessage defaultMessage="Active" />
                    </Label>
                );
            case "completed":
                return (
                    <Label variant="ghost" color="success">
                        <FormattedMessage defaultMessage="Completed" />
                    </Label>
                );
            case "canceled":
                return (
                    <Label variant="ghost" color="error">
                        <FormattedMessage defaultMessage="Canceled" />
                    </Label>
                );
            case "disputed":
                return (
                    <Label variant="ghost" color="warning">
                        <FormattedMessage defaultMessage="Disputed" />
                    </Label>
                );
            default:
                return null;
        }
    }, [status]);
};

export default StatusTableCell;
