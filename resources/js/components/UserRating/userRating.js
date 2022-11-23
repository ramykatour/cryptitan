import React from "react";
import {Rating, Stack, Typography} from "@mui/material";
import {formatNumber} from "utils/formatter";
import {FormattedMessage} from "react-intl";

const UserRating = ({
    user,
    variant = "caption",
    size = "small",
    color = "text.secondary"
}) => {
    return user.total_rating >= 3 ? (
        <Stack direction="row" alignItems="center" spacing={1}>
            <Rating
                size={size}
                value={user.average_rating}
                precision={0.5}
                readOnly
            />

            <Typography variant={variant} color={color}>
                ({formatNumber(user.total_rating)})
            </Typography>
        </Stack>
    ) : (
        <Typography variant={variant} color={color}>
            <FormattedMessage defaultMessage="No Rating." />
        </Typography>
    );
};

export default UserRating;
