import React, {useCallback, useContext} from "react";
import {Card, CardActions, CardContent, CardHeader} from "@mui/material";
import {FormattedMessage} from "react-intl";
import WarningIcon from "@mui/icons-material/Warning";
import UserContext from "contexts/UserContext";
import {LoadingButton} from "@mui/lab";
import {TwoFactorIllustration} from "assets/index";
import Result from "components/Result";
import PopConfirm from "components/PopConfirm";
import {errorHandler, route, useRequest} from "services/Http";
import Spin from "components/Spin";

const TwoFactor = () => {
    const [request, loading] = useRequest();
    const {user, fetchUser} = useContext(UserContext);

    const disableTwoFactor = useCallback(() => {
        request
            .post(route("admin.user.disable-two-factor", {user: user.id}))
            .then(() => fetchUser())
            .catch(errorHandler());
    }, [request, user, fetchUser]);

    const resetTwoFactor = useCallback(() => {
        request
            .post(route("admin.user.reset-two-factor", {user: user.id}))
            .then(() => fetchUser())
            .catch(errorHandler());
    }, [request, user, fetchUser]);

    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="2FA Security" />}
            />

            <CardContent>
                <Spin spinning={loading}>
                    {user.two_factor_enable ? (
                        <Result
                            title={
                                <FormattedMessage defaultMessage="2FA Enabled" />
                            }
                            description={
                                <FormattedMessage defaultMessage="Two factor is enabled." />
                            }
                            iconSize={150}
                            icon={TwoFactorIllustration}
                            sx={{py: 0}}
                        />
                    ) : (
                        <Result
                            title={
                                <FormattedMessage defaultMessage="2FA Disabled" />
                            }
                            description={
                                <FormattedMessage defaultMessage="Two factor is disabled." />
                            }
                            iconSize={150}
                            sx={{py: 0}}
                        />
                    )}
                </Spin>
            </CardContent>

            <CardActions sx={{justifyContent: "flex-end"}}>
                {user.two_factor_enable && (
                    <PopConfirm
                        variant="outlined"
                        component={LoadingButton}
                        content={
                            <FormattedMessage defaultMessage="Are you sure?" />
                        }
                        startIcon={<WarningIcon />}
                        onClick={disableTwoFactor}
                        color="inherit">
                        <FormattedMessage defaultMessage="Disable" />
                    </PopConfirm>
                )}

                <PopConfirm
                    variant="contained"
                    component={LoadingButton}
                    content={
                        <FormattedMessage defaultMessage="The user will be unable to login if 2FA is enabled. Are you sure?" />
                    }
                    onClick={resetTwoFactor}
                    color="primary">
                    <FormattedMessage defaultMessage="Reset" />
                </PopConfirm>
            </CardActions>
        </Card>
    );
};

export default TwoFactor;
