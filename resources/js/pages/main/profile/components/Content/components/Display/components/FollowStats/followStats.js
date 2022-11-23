import React, {useContext} from "react";
import {Card, Stack, Typography, Divider, CardContent} from "@mui/material";
import {formatNumber} from "utils/formatter";
import {FormattedMessage} from "react-intl";
import UserContext from "contexts/UserContext";

const FollowStats = () => {
    const {user} = useContext(UserContext);
    return (
        <Card>
            <CardContent>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}>
                    <Stack width={1} textAlign="center">
                        <Typography variant="h4">
                            {formatNumber(user.followers_count)}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{color: "text.secondary"}}>
                            <FormattedMessage defaultMessage="Followers" />
                        </Typography>
                    </Stack>

                    <Stack width={1} textAlign="center">
                        <Typography variant="h4">
                            {formatNumber(user.following_count)}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{color: "text.secondary"}}>
                            <FormattedMessage defaultMessage="Following" />
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default FollowStats;
