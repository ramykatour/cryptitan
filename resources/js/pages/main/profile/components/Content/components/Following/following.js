import React, {useContext, useRef} from "react";
import UserContext from "contexts/UserContext";
import {Box, Grid, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import InfiniteLoader from "components/InfiniteLoader";
import {route} from "services/Http";
import UserCard, {UserLoader} from "../UserCard";
import Result from "components/Result";

const Following = () => {
    const loaderRef = useRef();
    const {user} = useContext(UserContext);

    return (
        <Box sx={{pt: 2}}>
            <Typography variant="h4" mb={3}>
                <FormattedMessage defaultMessage="Following" />
            </Typography>

            <Grid container spacing={3}>
                <InfiniteLoader
                    ref={loaderRef}
                    url={route("user.profile.following-paginate", {
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

export default Following;
