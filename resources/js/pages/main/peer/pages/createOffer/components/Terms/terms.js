import React from "react";
import {Alert, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import Summary from "./components/Summary";
import Navigation from "./components/Navigation";
import InstructionField from "./components/InstructionField";
import AutoReplyField from "./components/AutoReplyField";
import VerificationField from "./components/VerificationField";
import LongTermField from "./components/LongTermField";
import FollowerField from "./components/FollowerField";

const Terms = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Card>
                    <CardContent>
                        <Stack spacing={3}>
                            <Typography
                                color="text.secondary"
                                variant="overline">
                                <FormattedMessage defaultMessage="Offer Terms" />
                            </Typography>

                            <InstructionField />
                            <AutoReplyField />

                            <Typography
                                color="text.secondary"
                                variant="overline">
                                <FormattedMessage defaultMessage="Requirements" />
                            </Typography>

                            <Alert severity="warning">
                                <FormattedMessage defaultMessage="Adding requirements will reduce the exposure of your Ad." />
                            </Alert>

                            <Stack>
                                <VerificationField />
                                <LongTermField />
                                <FollowerField />
                            </Stack>
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

export default Terms;
