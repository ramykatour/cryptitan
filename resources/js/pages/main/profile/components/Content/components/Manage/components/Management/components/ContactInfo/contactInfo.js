import React from "react";
import {Paper, Stack, Typography} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorIcon from "@mui/icons-material/Error";
import Copyable from "components/Copyable";
import {FormattedMessage} from "react-intl";

const ContactInfo = ({title, content, verified}) => {
    return (
        <Paper variant="outlined" sx={{px: 2, py: 1}}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="caption" color="text.secondary">
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

export default ContactInfo;
