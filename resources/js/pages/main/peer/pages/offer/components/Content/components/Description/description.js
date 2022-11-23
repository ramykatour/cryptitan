import React, {useMemo} from "react";
import {Box, Grid, Stack, Typography, useMediaQuery} from "@mui/material";
import verifiedUser from "@iconify/icons-ic/round-verified-user";
import roundChat from "@iconify/icons-ic/round-chat";
import clockFill from "@iconify/icons-eva/clock-fill";
import {alpha, styled, useTheme} from "@mui/material/styles";
import {defineMessages, useIntl} from "react-intl";
import Iconify from "components/Iconify";

// prettier-ignore
const messages = defineMessages({
    escrowTitle: {defaultMessage: "Secure Escrow"},
    escrowExtra: {defaultMessage: "Your crypto is held securely until the trade is completed."},
    chatTitle: {defaultMessage: "Realtime Chat"},
    chatExtra: {defaultMessage: "Engage in realtime conversation with the trader."},
    speedTitle: {defaultMessage: "Fast & Easy"},
    speedExtra: {defaultMessage: "Your account is credited instantly upon completion."},
});

const Description = () => {
    const theme = useTheme();
    const visible = useMediaQuery(theme.breakpoints.up("md"));
    const intl = useIntl();

    const description = useMemo(
        () => [
            {
                title: intl.formatMessage(messages.escrowTitle),
                description: intl.formatMessage(messages.escrowExtra),
                icon: verifiedUser
            },
            {
                title: intl.formatMessage(messages.chatTitle),
                description: intl.formatMessage(messages.chatExtra),
                icon: roundChat
            },
            {
                title: intl.formatMessage(messages.speedTitle),
                description: intl.formatMessage(messages.speedExtra),
                icon: clockFill
            }
        ],
        [intl]
    );

    return (
        visible && (
            <Box component="div" sx={{py: 3}}>
                <Grid container spacing={2}>
                    {description.map((item, key) => (
                        <Grid item xs={12} md={4} key={key} sx={{py: 2}}>
                            <Stack
                                alignItems="center"
                                sx={{
                                    maxWidth: 200,
                                    textAlign: "center",
                                    mx: "auto"
                                }}>
                                <IconWrapper>
                                    <Iconify
                                        icon={item.icon}
                                        width={36}
                                        height={36}
                                    />
                                </IconWrapper>

                                <Typography variant="subtitle1" gutterBottom>
                                    {item.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    {item.description}
                                </Typography>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        )
    );
};

const IconWrapper = styled("div")(({theme}) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    marginBottom: theme.spacing(3),
    borderRadius: "50%",
    color: theme.palette.primary.main,
    backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
    height: theme.spacing(8),
    width: theme.spacing(8)
}));

export default Description;
