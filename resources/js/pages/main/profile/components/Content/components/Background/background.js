import React, {useCallback, useContext} from "react";
import {alpha, styled} from "@mui/material/styles";
import UserAvatar from "components/UserAvatar";
import {Box, Typography} from "@mui/material";
import userCover from "static/user-cover.jpg";
import Image from "components/Image";
import {isEmpty, toLower} from "lodash";
import UserContext from "contexts/UserContext";
import {errorHandler, route, useRequest} from "services/Http";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {LoadingButton} from "@mui/lab";
import {FormattedMessage} from "react-intl";

const Background = () => {
    return (
        <Container>
            <StyledImage src={userCover} />
            <Wrapper>
                <Content>
                    <ProfileAvatar />
                    <ProfileDetails />
                    <FollowButton />
                </Content>
            </Wrapper>
        </Container>
    );
};

const ProfileAvatar = () => {
    const {user} = useContext(UserContext);

    return (
        <Box sx={{textAlign: "center"}}>
            <UserAvatar
                user={user}
                sx={{
                    borderStyle: "solid",
                    borderColor: "common.white",
                    height: {xs: 80, md: 128},
                    fontSize: {xs: 40, md: 64},
                    width: {xs: 80, md: 128},
                    borderWidth: 2
                }}
            />
        </Box>
    );
};

const ProfileDetails = () => {
    const {user} = useContext(UserContext);

    return (
        <TextBox sx={{color: "common.white"}}>
            <Typography variant="h4" sx={{opacity: 0.9}} noWrap>
                {toLower(user.name)}
            </Typography>

            <Typography sx={{opacity: 0.72}} noWrap>
                {user.profile.full_name}
            </Typography>
        </TextBox>
    );
};

const FollowButton = () => {
    const {user, fetchUser} = useContext(UserContext);
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

    if (!isEmpty(user.following)) {
        return (
            <StyledButton
                color="inherit"
                variant="outlined"
                size="small"
                sx={{color: "common.white"}}
                startIcon={<FavoriteBorderIcon />}
                onClick={unfollow}
                loading={loading}>
                <FormattedMessage defaultMessage="Unfollow" />
            </StyledButton>
        );
    }

    return (
        <StyledButton
            color="primary"
            variant="contained"
            size="small"
            startIcon={<FavoriteIcon />}
            onClick={follow}
            loading={loading}>
            <FormattedMessage defaultMessage="Follow" />
        </StyledButton>
    );
};

const StyledImage = styled(Image)(({theme}) => ({
    height: `calc(100% - ${theme.spacing(6)})`,
    width: "100%",
    position: "absolute"
}));

const Container = styled("div")(({theme}) => ({
    height: "100%",
    zIndex: 9,
    "&:before": {
        position: "absolute",
        backgroundColor: alpha(theme.palette.primary.darker, 0.8),
        height: `calc(100% - ${theme.spacing(6)})`,
        width: "100%",
        content: "''",
        WebkitBackdropFilter: `blur(2px)`,
        backdropFilter: `blur(2px)`,
        zIndex: 9
    }
}));

const Wrapper = styled("div")(({theme}) => ({
    display: "flex",
    position: "relative",
    justifyContent: "flex-end",
    flexDirection: "column",
    height: "100%",
    paddingBottom: theme.spacing(6),
    zIndex: 99,
    [theme.breakpoints.up("md")]: {
        paddingBottom: theme.spacing(3)
    }
}));

const Content = styled("div")(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: theme.spacing(5),
    [theme.breakpoints.up("md")]: {
        flexDirection: "row",
        paddingRight: theme.spacing(3),
        paddingLeft: theme.spacing(3)
    }
}));

const TextBox = styled(Box)(({theme}) => ({
    textAlign: "center",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
        marginTop: 0,
        marginLeft: theme.spacing(3),
        flexGrow: 1,
        textAlign: "left"
    }
}));

const StyledButton = styled(LoadingButton)(({theme}) => ({
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
        marginTop: 0,
        marginBottom: 0
    }
}));

export default Background;
