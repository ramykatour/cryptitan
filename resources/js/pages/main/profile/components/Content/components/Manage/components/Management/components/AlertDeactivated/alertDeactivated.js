import React, {useCallback, useContext} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import UserContext from "contexts/UserContext";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {LoadingButton} from "@mui/lab";
import {Alert} from "@mui/material";

const messages = defineMessages({
    until: {defaultMessage: "Until"},
    activated: {defaultMessage: "User was activated."},
    deactivateUser: {defaultMessage: "Deactivate User"},
    updateUser: {defaultMessage: "Update User"},
    deactivated: {defaultMessage: "User was deactivated."},
    success: {defaultMessage: "User was updated."},
    lastName: {defaultMessage: "Last Name"},
    firstName: {defaultMessage: "First Name"},
    country: {defaultMessage: "Country"}
});

const AlertDeactivated = () => {
    const intl = useIntl();
    const {user, fetchUser} = useContext(UserContext);
    const [request, loading] = useRequest();

    const activateUser = useCallback(() => {
        request
            .post(route("admin.user.activate", {user: user.id}))
            .then(() => {
                notify.success(intl.formatMessage(messages.activated));
                fetchUser();
            })
            .catch(errorHandler());
    }, [request, user, intl, fetchUser]);

    if (user.isActive()) {
        return null;
    }

    const action = (
        <LoadingButton
            color="inherit"
            sx={{textTransform: "uppercase"}}
            onClick={activateUser}
            loading={loading}
            size="small">
            <FormattedMessage defaultMessage="Activate" />
        </LoadingButton>
    );

    const date = user.deactivatedUntil();

    return (
        <Alert severity="error" action={action} sx={{mb: 3}}>
            <FormattedMessage
                defaultMessage="This user has been deactivated until {date}"
                values={{date: <b>{date.format("LLL")}</b>}}
            />
        </Alert>
    );
};

export default AlertDeactivated;
