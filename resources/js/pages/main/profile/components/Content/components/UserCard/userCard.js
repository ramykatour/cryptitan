import React, {forwardRef, useCallback, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Skeleton,
    Stack,
    Typography
} from "@mui/material";
import UserAvatar from "components/UserAvatar";
import Iconify from "components/Iconify";
import {experimentalStyled as styled} from "@mui/material/styles";
import {FormattedMessage} from "react-intl";
import mapPin from "@iconify-icons/ri/map-pin-fill";
import checkbox from "@iconify-icons/ri/checkbox-circle-fill";
import {isEmpty} from "lodash";
import {errorHandler, route, useRequest} from "services/Http";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";
import ProfileLink from "components/ProfileLink";

const UserCard = ({user: data}) => {
    const [user, setUser] = useState(data);
    const [request, loading] = useRequest();

    const fetchUser = useCallback(() => {
        request
            .get(route("user.profile.get", {user: user.name}))
            .then((data) => setUser(data))
            .catch(errorHandler());
    }, [request, user]);

    return (
        <Card>
            <Spin spinning={loading}>
                <StyledCardContent>
                    <UserAvatar user={user} sx={{width: 48, height: 48}} />

                    <StyledBox>
                        <Typography
                            user={user}
                            component={ProfileLink}
                            variant="subtitle2"
                            color="text.primary"
                            noWrap>
                            {user.name}
                        </Typography>

                        <Stack
                            direction="row"
                            alignItems="center"
                            sx={{minWidth: 0}}>
                            <StyledIconify icon={mapPin} />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap>
                                {!user.country ? (
                                    <FormattedMessage defaultMessage="Unavailable" />
                                ) : (
                                    user.country_name
                                )}
                            </Typography>
                        </Stack>
                    </StyledBox>

                    <FollowButton user={user} fetchUser={fetchUser} />
                </StyledCardContent>
            </Spin>
        </Card>
    );
};

const FollowButton = ({user, fetchUser}) => {
    const [request, loading] = useRequest();

    const follow = useCallback(() => {
        request
            .post(route("user.profile.follow", {user: user.name}))
            .then(() => fetchUser())
            .catch(errorHandler());
    }, [request, user, fetchUser]);

    const unfollow = useCallback(() => {
        request
            .post(route("user.profile.unfollow", {user: user.name}))
            .then(() => fetchUser())
            .catch(errorHandler());
    }, [request, user, fetchUser]);

    if (!user.followable) {
        return null;
    }

    if (isEmpty(user.following)) {
        return (
            <LoadingButton
                color="inherit"
                variant="outlined"
                size="small"
                onClick={follow}
                loading={loading}>
                <FormattedMessage defaultMessage="Follow" />
            </LoadingButton>
        );
    }

    return (
        <LoadingButton
            variant="text"
            color="primary"
            startIcon={<Iconify icon={checkbox} />}
            onClick={unfollow}
            loading={loading}
            size="small">
            <FormattedMessage defaultMessage="Followed" />
        </LoadingButton>
    );
};

const StyledBox = styled(Box)(({theme}) => ({
    flexGrow: 1,
    minWidth: 0,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2)
}));

const StyledIconify = styled(Iconify)(({theme}) => ({
    height: 16,
    width: 16,
    flexShrink: 0,
    marginRight: theme.spacing(0.5)
}));

const StyledCardContent = styled(CardContent)({
    display: "flex",
    alignItems: "center"
});

export const UserLoader = forwardRef((props, ref) => {
    const {count = 3} = props;

    return [...Array(count)].map((_, index) => {
        return (
            <Grid
                key={index}
                ref={index !== 0 ? undefined : ref}
                {...{xs: 12, sm: 6, md: 4}}
                item>
                <Skeleton
                    height={96}
                    variant="rectangular"
                    width="100%"
                    sx={{borderRadius: 2}}
                    animation="wave"
                />
            </Grid>
        );
    });
});

export default UserCard;
