import React from "react";
import {Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import TypeSelect from "./components/TypeSelect";
import PriceTypeSelect from "./components/PriceTypeSelect";
import PriceField from "./components/PriceField";
import Summary from "./components/Summary";
import Navigation from "./components/Navigation";
import AssetsField from "./components/AssetsField";

const Price = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Card>
                    <CardContent>
                        <Stack spacing={3}>
                            <TypeSelect />
                            <AssetsField />

                            <Typography
                                color="text.secondary"
                                variant="overline">
                                <FormattedMessage defaultMessage="Price Settings" />
                            </Typography>

                            <PriceTypeSelect />
                            <PriceField />
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

export default Price;
