import React, {useCallback, useMemo, useState} from "react";
import {
    Box,
    Container,
    Grid,
    Step,
    StepLabel,
    Stepper,
    useMediaQuery
} from "@mui/material";
import Page from "components/Page";
import {defineMessages, useIntl} from "react-intl";
import SelectAccount from "components/SelectAccount";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";
import Form from "components/Form";
import {useAuth} from "models/Auth";
import {useAccountEffect, useValuesChangeHandler} from "./hooks";
import Price from "./components/Price";
import Payment from "./components/Payment";
import Terms from "./components/Terms";
import StepConnector from "components/StepConnector";
import StepIcon from "components/StepIcon";
import {StepProvider} from "contexts/StepContext";
import SwipeableViews from "react-swipeable-views";
import {useTheme} from "@mui/material/styles";
import {route, useFormRequest} from "services/Http";
import {has, tap} from "lodash";
import {notify} from "utils/index";
import router from "router/router";
import {useNavigate} from "react-router-dom";

const messages = defineMessages({
    title: {defaultMessage: "Create Offer"},
    success: {defaultMessage: "Your offer was created."},
    errors: {defaultMessage: "Please check your inputs and try again."},
    price: {defaultMessage: "Price"},
    payment: {defaultMessage: "Payment"},
    terms: {defaultMessage: "Terms"}
});

const CreateOffer = () => {
    const theme = useTheme();
    const [form] = Form.useForm();
    const intl = useIntl();
    const auth = useAuth();
    const [current, setCurrent] = useState(0);
    const upSm = useMediaQuery(theme.breakpoints.up("sm"));
    const handleValuesChange = useValuesChangeHandler();
    const [request, loading] = useFormRequest(form);
    const navigate = useNavigate();
    const xSpacing = upSm ? 3 : 2;
    const ySpacing = 4;

    useAccountEffect(form);

    const next = useCallback(() => {
        setCurrent((c) => c + 1);
    }, [setCurrent]);

    const prev = useCallback(() => {
        setCurrent((c) => c - 1);
    }, [setCurrent]);

    const steps = useMemo(
        () => [
            {
                label: intl.formatMessage(messages.price),
                component: <Price />
            },
            {
                label: intl.formatMessage(messages.payment),
                component: <Payment />
            },
            {
                label: intl.formatMessage(messages.terms),
                component: <Terms />
            }
        ],
        [intl]
    );

    const initialValues = useMemo(
        () => ({
            type: "buy",
            currency: auth.user.currency,
            price_type: "fixed",
            payment: "bank_account"
        }),
        [auth]
    );

    const submitForm = useCallback(
        (values) => {
            request
                .post(route("peer-offer.create"), normalize(values))
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    if (values.type === "buy") {
                        navigate(router.generatePath("main.peer.sell-crypto"));
                    } else {
                        navigate(router.generatePath("main.peer.buy-crypto"));
                    }
                })
                .catch(({response, canceled}) => {
                    if (!canceled && has(response, "data.errors")) {
                        notify.error(intl.formatMessage(messages.errors));
                    }
                });
        },
        [request, navigate, intl]
    );

    return (
        <Page title={intl.formatMessage(messages.title)}>
            <Container>
                <HeaderBreadcrumbs
                    action={<SelectAccount sx={{width: 150}} />}
                />

                <Form
                    form={form}
                    initialValues={initialValues}
                    onValuesChange={handleValuesChange}
                    onFinish={submitForm}>
                    <Grid container justifyContent="center" mb={5}>
                        <Grid item xs={12} md={8}>
                            <Stepper
                                alternativeLabel
                                connector={<StepConnector />}
                                activeStep={current}>
                                {steps.map((step, key) => (
                                    <Step key={key}>
                                        <StepLabel
                                            StepIconComponent={StepIcon}
                                            sx={{
                                                "& .MuiStepLabel-label": {
                                                    typography: "subtitle2",
                                                    color: "text.disabled"
                                                }
                                            }}>
                                            {step.label}
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Grid>
                    </Grid>

                    <StepProvider next={next} prev={prev} loading={loading}>
                        <SwipeableViews
                            disabled={true}
                            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                            onChangeIndex={(v) => setCurrent(v)}
                            index={current}
                            style={{
                                margin: theme.spacing(-ySpacing, -xSpacing)
                            }}>
                            {steps.map((step, key) => (
                                <Box
                                    key={key}
                                    sx={{px: xSpacing, py: ySpacing}}
                                    component="div">
                                    {step.component}
                                </Box>
                            ))}
                        </SwipeableViews>
                    </StepProvider>
                </Form>
            </Container>
        </Page>
    );
};

const normalize = (values) => {
    return tap(values, (values) => {
        values.payment_method = values.payment_method?.id;
        values.bank_account = values.bank_account?.id;
    });
};

export default CreateOffer;
