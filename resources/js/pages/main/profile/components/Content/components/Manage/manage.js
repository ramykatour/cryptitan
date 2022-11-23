import React from "react";
import {Grid} from "@mui/material";
import Activity from "./components/Activity";
import TwoFactor from "./components/TwoFactor";
import ResetPassword from "./components/ResetPassword";
import Management from "./components/Management";
import Permissions from "./components/Permissions";
import {useAuth} from "models/Auth";

const Manage = () => {
    const auth = useAuth();

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Management />
                    </Grid>

                    <Grid item xs={12}>
                        <Activity />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ResetPassword />
                    </Grid>

                    <Grid item xs={12}>
                        <TwoFactor />
                    </Grid>

                    {auth.user.isSuperAdmin() && (
                        <Grid item xs={12}>
                            <Permissions />
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Manage;
