import React, {Fragment, useRef} from "react";
import PropTypes from "prop-types";
import {Icon as BaseIcon} from "@iconify/react";
import {SnackbarProvider} from "notistack";
import infoFill from "@iconify/icons-eva/info-fill";
import alertCircleFill from "@iconify/icons-eva/alert-circle-fill";
import alertTriangleFill from "@iconify/icons-eva/alert-triangle-fill";
import checkmarkCircle from "@iconify/icons-eva/checkmark-circle-2-fill";
import {alpha, useTheme} from "@mui/material/styles";
import {Box, Collapse, GlobalStyles} from "@mui/material";
import useSettings from "hooks/useSettings";

function SnackbarStyles() {
    const theme = useTheme();

    return (
        <GlobalStyles
            styles={{
                ".SnackbarContent-root": {
                    width: "100%",
                    padding: `${theme.spacing(1.5)} !important`,
                    margin: `${theme.spacing(0.25, 0)} !important`,
                    borderRadius: `${theme.shape.borderRadius} !important`,
                    boxShadow: `${theme.customShadows.z8} !important`,
                    backgroundColor: `${theme.palette.background.paper} !important`,
                    color: `${theme.palette.text.primary} !important`,
                    [theme.breakpoints.up("md")]: {
                        minWidth: `240 !important`
                    }
                },
                ".SnackbarItem-message": {
                    padding: "0 !important",
                    fontWeight: theme.typography.fontWeightMedium
                },
                ".SnackbarItem-action": {
                    marginRight: `0 !important`,
                    color: theme.palette.action.active,
                    "& svg": {width: 20, height: 20}
                }
            }}
        />
    );
}

function Icon({icon, color}) {
    return (
        <Box
            component="span"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 1.5,
                width: 40,
                height: 40,
                mr: 1.5,
                color: `${color}.main`,
                bgcolor: (theme) => alpha(theme.palette[color].main, 0.16)
            }}>
            <BaseIcon icon={icon} width={24} height={24} />
        </Box>
    );
}

Icon.propTypes = {
    icon: PropTypes.object,
    color: PropTypes.string
};

function NotistackProvider({children}) {
    const {themeDirection} = useSettings();
    const notistackRef = useRef();

    const isRTL = themeDirection === "rtl";

    return (
        <Fragment>
            <SnackbarStyles />

            <SnackbarProvider
                ref={notistackRef}
                maxSnack={5}
                dense
                autoHideDuration={3000}
                preventDuplicate
                variant="success"
                TransitionComponent={isRTL ? Collapse : undefined}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
                iconVariant={{
                    info: <Icon icon={infoFill} color="info" />,
                    success: <Icon icon={checkmarkCircle} color="success" />,
                    warning: <Icon icon={alertTriangleFill} color="warning" />,
                    error: <Icon icon={alertCircleFill} color="error" />
                }}>
                {children}
            </SnackbarProvider>
        </Fragment>
    );
}

NotistackProvider.propTypes = {children: PropTypes.node};

export default NotistackProvider;
