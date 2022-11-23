import React, {Fragment, useCallback} from "react";
import {
    Box,
    Chip,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import {alpha, experimentalStyled as styled} from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import shapedAvatar from "static/icons/shape-avatar.svg";
import coverImg from "static/user-cover.jpg";
import {useModal} from "utils/modal";
import UserAvatar from "components/UserAvatar";
import User from "models/User";
import {Icon} from "@iconify/react";
import quoteIcon from "@iconify-icons/ri/double-quotes-l";
import {FormattedMessage} from "react-intl";
import {defaultTo, isEmpty} from "lodash";
import Copyable from "components/Copyable";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorIcon from "@mui/icons-material/Error";
import ProfileLink from "components/ProfileLink";
import {formatDateFromNow} from "utils/formatter";

const UserView = ({user}) => {
    const [modal, modalElements] = useModal();

    const showUser = useCallback(() => {
        modal.confirm({
            content: <ViewCard user={user} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, user]);

    return (
        <Fragment>
            <IconButton onClick={showUser}>
                <VisibilityIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const ViewCard = ({user: data}) => {
    const user = User.use(data);

    const cover = defaultTo(user.profile?.picture, coverImg);
    const roles = user.get("all_roles", []);

    return (
        <ContainerBox>
            <CardMediaStyle>
                <CoverImgStyle src={cover} />
                <ShapeAvatarBox component="span" />
                <Box
                    sx={{
                        zIndex: 12,
                        display: "inline-block",
                        position: "absolute",
                        bottom: -34
                    }}>
                    <UserAvatar
                        sx={{height: 64, fontSize: 32, width: 64}}
                        user={user}
                    />
                </Box>
            </CardMediaStyle>

            {user.profile?.bio && (
                <Tooltip title={user.profile.bio}>
                    <ProfileQuoteStyle>
                        <Box sx={{mr: 1}}>
                            <Icon icon={quoteIcon} width={25} height={25} />
                        </Box>
                        <Typography variant="body2">
                            {user.profile.bio}
                        </Typography>
                    </ProfileQuoteStyle>
                </Tooltip>
            )}

            <Box sx={{mb: 5, px: 3}}>
                <Stack alignItems="center">
                    <Typography
                        user={user}
                        component={ProfileLink}
                        variant="subtitle1"
                        noWrap>
                        {user.name}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{color: "text.secondary"}}
                        noWrap>
                        {user.profile.full_name}
                    </Typography>
                </Stack>

                {!isEmpty(roles) && (
                    <Box sx={{mt: 1, textAlign: "center"}}>
                        {roles.map((role, key) => (
                            <Chip
                                key={key}
                                label={role}
                                size="small"
                                sx={{m: 1}}
                            />
                        ))}
                    </Box>
                )}

                <Grid container spacing={2} sx={{pt: 2}}>
                    <Grid item xs={12} sm={6}>
                        <ContactInfo
                            title={
                                <FormattedMessage defaultMessage="Email Address" />
                            }
                            verified={user.hasVerifiedEmail()}
                            content={user.email}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <ContactInfo
                            title={
                                <FormattedMessage defaultMessage="Phone Number" />
                            }
                            verified={user.hasVerifiedPhone()}
                            content={user.phone}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Divider />

            <Grid
                container
                sx={{py: 3, px: 1, textAlign: "center"}}
                spacing={2}>
                <DateInfo
                    title={<FormattedMessage defaultMessage="Last Login" />}
                    date={user.last_login_at}
                />

                <DateInfo
                    title={<FormattedMessage defaultMessage="Registered" />}
                    date={user.created_at}
                />

                <DateInfo
                    title={<FormattedMessage defaultMessage="Last Seen" />}
                    date={user.last_seen_at}
                />
            </Grid>
        </ContainerBox>
    );
};

const DateInfo = ({title, date}) => {
    return (
        <Grid item xs={4}>
            <Typography
                sx={{color: "text.secondary", display: "block"}}
                variant="caption">
                {title}
            </Typography>

            <Typography sx={{mt: 0.5}} variant="subtitle2" noWrap>
                {formatDateFromNow(date)}
            </Typography>
        </Grid>
    );
};

const ContactInfo = ({title, content, verified}) => {
    return (
        <Paper variant="outlined" sx={{px: 2, py: 1}}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{color: "text.secondary"}} variant="caption">
                    {title}
                </Typography>

                {verified ? (
                    <VerifiedIcon color="primary" fontSize="inherit" />
                ) : (
                    <ErrorIcon color="warning" fontSize="inherit" />
                )}
            </Stack>

            {content ? (
                <Copyable variant="body2" ellipsis>
                    {content}
                </Copyable>
            ) : (
                <Typography variant="body2" sx={{lineHeight: "28px"}} noWrap>
                    <FormattedMessage defaultMessage="Unavailable" />
                </Typography>
            )}
        </Paper>
    );
};

const ContainerBox = styled(Box)(({theme}) => ({
    margin: theme.spacing(0, -3),
    position: "relative"
}));

const ShapeAvatarBox = styled(Box)(({theme}) => ({
    width: 144,
    height: 62,
    zIndex: 11,
    mask: `url(${shapedAvatar}) no-repeat center / contain`,
    WebkitMask: `url(${shapedAvatar}) no-repeat center / contain`,
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    bottom: -26
}));

const CoverImgStyle = styled("img")({
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    objectFit: "cover",
    zIndex: 8
});

const CardMediaStyle = styled("div")(({theme}) => ({
    display: "flex",
    justifyContent: "center",
    position: "relative",
    height: 180,
    marginBottom: 50,
    "&:before": {
        content: "''",
        position: "absolute",
        top: 0,
        backgroundColor: alpha(theme.palette.primary.darker, 0.72),
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        width: "100%",
        zIndex: 9,
        height: "100%"
    }
}));

const ProfileQuoteStyle = styled("div")(({theme}) => ({
    height: 130,
    overflow: "hidden",
    color: theme.palette.common.white,
    position: "absolute",
    top: 0,
    zIndex: 10,
    left: 0,
    padding: theme.spacing(3, 3, 0, 3),
    display: "flex"
}));

export default UserView;
