import React from "react";
import {Box, Stack, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {styled} from "@mui/material/styles";

const ContentInfo = ({icon, title, content}) => {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            <IconWrapper>{icon}</IconWrapper>

            <TextWrapper>
                <Typography variant="caption" color="text.secondary" noWrap>
                    {title}
                </Typography>

                <Typography variant="body2" noWrap>
                    {content || <FormattedMessage defaultMessage="Unknown" />}
                </Typography>
            </TextWrapper>
        </Stack>
    );
};

const IconWrapper = styled(Box)(({theme}) => ({
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.background.neutral,
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius * 1.5,
    width: 40,
    height: 40
}));

const TextWrapper = styled(Box)({
    flexGrow: 1,
    minWidth: 0
});

export default ContentInfo;
