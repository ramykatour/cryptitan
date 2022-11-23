import React, {useMemo} from "react";
import router from "router/router";
import {Link} from "react-router-dom";
import {Box} from "@mui/material";

const ProfileLink = ({user, sx, ...otherProps}) => {
    const link = useMemo(() => {
        return router.generatePath("main.profile", {name: user.name});
    }, [user]);

    return (
        <Box
            component={Link}
            sx={{
                minWidth: 0,
                textDecoration: "none",
                color: "text.primary",
                ...sx
            }}
            to={link}
            {...otherProps}
        />
    );
};

export default ProfileLink;
