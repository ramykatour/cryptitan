import React from "react";
import {Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import AmountField from "./components/AmountField";
import Summary from "./components/Summary";
import Navigation from "./components/Navigation";
import {FormattedMessage} from "react-intl";
import PaymentField from "./components/PaymentField";
import PaymentSelect from "./components/PaymentSelect";
import TimeLimitField from "./components/TimeLimitField";
import VisibilityAlert from "./components/VisibilityAlert";

const Payment = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Card>
                    <CardContent>
                        <Stack spacing={3}>
                            <Typography
                                color="text.secondary"
                                variant="overline">
                                <FormattedMessage defaultMessage="Offer Limit" />
                            </Typography>

                            <VisibilityAlert />
                            <AmountField />

                            <Typography
                                color="text.secondary"
                                variant="overline">
                                <FormattedMessage defaultMessage="Payment" />
                            </Typography>

                            <PaymentSelect />
                            <PaymentField />

                            <Typography
                                color="text.secondary"
                                variant="overline">
                                <FormattedMessage defaultMessage="Time Limit" />
                            </Typography>

                            <TimeLimitField />
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Summary />
                    </Grid>

                    <Grid item xs={12}>
                        <Navigation />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Payment;
