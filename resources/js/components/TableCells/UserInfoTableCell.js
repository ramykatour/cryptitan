import React from "react";
import {isEmpty} from "lodash";
import {Stack, Typography} from "@mui/material";
import UserAvatar from "components/UserAvatar";
import ProfileLink from "components/ProfileLink";
import FlagIcon from "components/FlagIcon";

const UserInfoTableCell = ({user}) => {
    if (isEmpty(user)) {
        return null;
    }

    return (
        <Stack
            direction="row"
            sx={{minWidth: 0}}
            alignItems="center"
            spacing={2}>
            <UserAvatar user={user} />

            <Stack sx={{flexGrow: 1, minWidth: 0}}>
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{minWidth: 0}}
                    spacing={1}>
                    <Typography
                        user={user}
                        component={ProfileLink}
                        variant="subtitle2"
                        noWrap>
                        {user.name}
                    </Typography>

                    {user.country && <FlagIcon code={user.country} />}
                </Stack>

                <Typography
                    variant="caption"
                    sx={{color: "text.secondary"}}
                    noWrap>
                    {user.email}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default UserInfoTableCell;
