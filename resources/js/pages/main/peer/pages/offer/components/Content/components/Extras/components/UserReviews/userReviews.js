import React, {forwardRef, useContext, useRef} from "react";
import {
    ListItem,
    Rating,
    Skeleton,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import {route} from "services/Http";
import Result from "components/Result";
import {FormattedMessage} from "react-intl";
import InfiniteLoader from "components/InfiniteLoader";
import Scrollbar from "components/Scrollbar";
import PeerOfferContext from "contexts/PeerOfferContext";
import UserAvatar from "components/UserAvatar";
import {formatDate} from "utils/formatter";
import {truncate} from "lodash";

const UserReviews = () => {
    const loaderRef = useRef();
    const {offer} = useContext(PeerOfferContext);

    return (
        <Scrollbar sx={{height: 360}}>
            <Stack sx={{p: 3}} spacing={5}>
                <InfiniteLoader
                    ref={loaderRef}
                    url={route("user.profile.reviews-paginate", {
                        user: offer.owner.name
                    })}
                    renderItem={(item) => (
                        <ReviewItem key={item.id} item={item} />
                    )}
                    renderEmpty={() => (
                        <Result
                            title={
                                <FormattedMessage defaultMessage="No reviews yet." />
                            }
                            description={
                                <FormattedMessage defaultMessage="Please check back later." />
                            }
                            iconSize={180}
                            sx={{py: 3}}
                        />
                    )}
                    renderSkeleton={(ref) => <ReviewLoader ref={ref} />}
                />
            </Stack>
        </Scrollbar>
    );
};

const ReviewItem = ({item}) => {
    return (
        <Stack
            disableGutters
            component={ListItem}
            direction={{xs: "column", sm: "row"}}
            alignItems="flex-start"
            spacing={3}>
            <Stack
                alignItems="center"
                direction={{xs: "row", sm: "column"}}
                sx={{
                    textAlign: {sm: "center"},
                    minWidth: {sm: 160, md: 240}
                }}
                spacing={2}>
                <UserAvatar
                    user={item.user}
                    sx={{
                        height: {xs: 40, md: 64},
                        fontSize: {xs: 20, md: 32},
                        width: {xs: 40, md: 64}
                    }}
                />

                <Stack spacing={0.5}>
                    <Typography variant="subtitle2" noWrap>
                        {item.user.name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" noWrap>
                        {formatDate(item.created_at)}
                    </Typography>
                </Stack>
            </Stack>

            <Stack spacing={1}>
                <Rating value={item.value} readOnly />

                <Tooltip title={item.comment}>
                    <Typography variant="body2">
                        {truncate(item.comment, {length: 200})}
                    </Typography>
                </Tooltip>
            </Stack>
        </Stack>
    );
};

const ReviewLoader = forwardRef((props, ref) => {
    return (
        <Stack ref={ref} direction={{xs: "column", sm: "row"}} spacing={3}>
            <Stack
                alignItems="center"
                direction={{xs: "row", sm: "column"}}
                sx={{minWidth: 160}}
                spacing={1}>
                <Skeleton variant="circular" width={64} height={64} />

                <Stack spacing={0.5}>
                    <Typography component="div" variant="subtitle2">
                        <Skeleton width={100} />
                    </Typography>

                    <Typography component="div" variant="caption">
                        <Skeleton width={100} />
                    </Typography>
                </Stack>
            </Stack>

            <Stack alignItems="center" width={1}>
                <Skeleton variant="rectangular" height={120} width="100%" />
            </Stack>
        </Stack>
    );
});

export default UserReviews;
