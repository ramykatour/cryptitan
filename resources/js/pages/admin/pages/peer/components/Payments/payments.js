import React from "react";
import {Grid} from "@mui/material";
import PaymentCategories from "./components/PaymentCategories";
import PaymentMethods from "./components/PaymentMethods";

const Payments = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <PaymentMethods />
            </Grid>

            <Grid item xs={12}>
                <PaymentCategories />
            </Grid>
        </Grid>
    );
};

export default Payments;
