import React from "react";
import {FormattedMessage} from "react-intl";
import Label from "components/Label";

const StatusTableCell = ({offer}) => {
    if (offer.closed_at) {
        return (
            <Label variant="ghost" color="error">
                <FormattedMessage defaultMessage="Closed" />
            </Label>
        );
    }

    return offer.display ? (
        <Label variant="ghost" color="success">
            <FormattedMessage defaultMessage="Visible" />
        </Label>
    ) : (
        <Label variant="ghost" color="warning">
            <FormattedMessage defaultMessage="Hidden" />
        </Label>
    );
};

export default StatusTableCell;
