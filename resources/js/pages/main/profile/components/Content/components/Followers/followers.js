import React, {useContext, useRef} from "react";
import {Box, Grid, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {route} from "services/Http";
import Result from "components/Result";
import InfiniteLoader from "components/InfiniteLoader";
import UserContext from "contexts/UserContext";
import UserCard, {UserLoader} from "../UserCard";

const Followers = () => {
    const loaderRef = useRef();
    const {user} = useContext(UserContext);

    return (
        <Box sx={{pt: 2}}>
            <Typography variant="h4" mb={3}>
                <FormattedMessage defaultMessage="Followers" />
            </Typography>

            <Grid container spacing={3}>
                <InfiniteLoader
                    ref={loaderRef}
                    url={route("user.profile.followers-paginate", {
                        user: user.name
                    })}
                    renderItem={(user) => (
                        <Grid key={user.id} item xs={12} sm={6} md={4}>
                            <UserCard user={user} />
                        </Grid>
                    )}
                    renderEmpty={() => (
                        <Grid item xs={12}>
                            <Result
                                title={
                                    <FormattedMessage defaultMessage="Nothing here." />
                                }
                                description={
                                    <FormattedMessage defaultMessage="There are no followers on this account." />
                                }
                            />
                        </Grid>
                    )}
                    renderSkeleton={(ref) => <UserLoader ref={ref} />}
                />
            </Grid>
        </Box>
    );
};

export default Followers;
