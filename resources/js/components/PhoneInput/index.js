import React from "react";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import {CircularProgress, Stack} from "@mui/material";
import {defineMessages} from "react-intl";

const messages = defineMessages({
    invalidPhone: {defaultMessage: "{field} is an invalid phone number"},
    passwordUnmatched: {defaultMessage: "password does not match."}
});

const componentImport = () =>
    pMinDelay(import(/* webpackChunkName: 'phoneInput' */ "./phoneInput"), 300);

const Component = loadable(componentImport, {
    fallback: (
        <Stack direction="column" justifyContent="center" alignItems="center">
            <CircularProgress size="1em" />
        </Stack>
    )
});

export function phoneValidator(phoneRef, intl) {
    return () => ({
        validator(rule, value) {
            const phone = phoneRef.current;

            if (value && phone && !phone.isValidNumber()) {
                const message = intl.formatMessage(messages.invalidPhone, {
                    field: rule.field
                });
                return Promise.reject(new Error(message));
            }

            return Promise.resolve();
        }
    });
}

export default (props) => {
    return <Component {...props} />;
};
