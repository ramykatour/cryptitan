import React, {useContext, useEffect} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {fetchUser} from "redux/slices/auth";
import {useDispatch} from "react-redux";
import {useAuth} from "models/Auth";
import {usePrivateBroadcast} from "services/Broadcast";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {Card, CardContent, CardHeader} from "@mui/material";
import Result from "components/Result";
import {LoadingButton} from "@mui/lab";
import {
    MailUnverifiedIllustration,
    MailVerifiedIllustration
} from "assets/index";
import StepContext from "contexts/StepContext";

const messages = defineMessages({
    emailSuccess: {defaultMessage: "Email was resent."}
});

const VerifyEmail = () => {
    const dispatch = useDispatch();
    const auth = useAuth();
    const intl = useIntl();
    const broadcast = usePrivateBroadcast("App.Models.User." + auth.user.id);
    const [request, loading] = useRequest();
    const {next} = useContext(StepContext);

    useEffect(() => {
        if (!auth.user.hasVerifiedEmail()) {
            const channel = "UserActivities.VerifiedEmail";
            const handler = () => dispatch(fetchUser());

            broadcast.listen(channel, handler);

            return () => {
                broadcast.stopListening(channel, handler);
            };
        }
    }, [dispatch, broadcast, auth]);

    const resendEmail = () => {
        request
            .post(route("email-verification.send"))
            .then(() => {
                notify.success(intl.formatMessage(messages.emailSuccess));
            })
            .catch(errorHandler());
    };

    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="Email Verification" />}
            />

            <CardContent>
                {auth.user.hasVerifiedEmail() ? (
                    <Result
                        title={
                            <FormattedMessage defaultMessage="Email Verified!" />
                        }
                        description={
                            <FormattedMessage defaultMessage="Your email has been verified." />
                        }
                        icon={MailVerifiedIllustration}
                        extra={
                            <LoadingButton
                                variant="contained"
                                onClick={() => next()}
                                loading={loading}>
                                <FormattedMessage defaultMessage="Next" />
                            </LoadingButton>
                        }
                    />
                ) : (
                    <Result
                        title={
                            <FormattedMessage defaultMessage="Check your email." />
                        }
                        description={
                            <FormattedMessage defaultMessage="We sent you a verification link." />
                        }
                        icon={MailUnverifiedIllustration}
                        iconProps={{
                            className: "animated infinite pulse"
                        }}
                        extra={
                            <LoadingButton
                                variant="outlined"
                                onClick={resendEmail}
                                loading={loading}>
                                <FormattedMessage defaultMessage="Resend Email" />
                            </LoadingButton>
                        }
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default VerifyEmail;
