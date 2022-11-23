import React from "react";
import {Box, Grid} from "@mui/material";
import AccountField from "./components/AccountField";
import CurrencyField from "./components/CurrencyField";

const AssetsField = () => {
    return (
        <Box component="div">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <AccountField />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CurrencyField />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AssetsField;
