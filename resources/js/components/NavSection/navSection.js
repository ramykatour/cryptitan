import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";
import {Icon} from "@iconify/react";
import {
    StyledListItem,
    StyledListItemIcon,
    StyledListItemText,
    StyledListSubheader
} from "./navSection.style";
import {matchPath, NavLink as RouterLink, useLocation} from "react-router-dom";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
import arrowIosDownwardFill from "@iconify/icons-eva/arrow-ios-downward-fill";
import {useTheme} from "@mui/material/styles";
import {isEmpty, isNull} from "lodash";
import {Box, Collapse, List, ListItemText} from "@mui/material";
import Iconify from "components/Iconify";

const DotIcon = ({active}) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                height: 4,
                width: 4,
                borderRadius: "50%",
                bgcolor: "text.disabled",
                transition: theme.transitions.create("transform", {
                    duration: theme.transitions.duration.shorter
                }),
                ...(active && {
                    transform: "scale(2)",
                    bgcolor: "primary.main"
                })
            }}
            component="span"
        />
    );
};

function NavItem({item, match}) {
    const activeRoot = match(item.path);
    const {title, path, icon, children} = item;
    const [open, setOpen] = useState(activeRoot);

    const toggle = useCallback(() => {
        setOpen((state) => !state);
    }, []);

    if (children) {
        return (
            <React.Fragment>
                <StyledListItem activeRoot={activeRoot} onClick={toggle}>
                    {icon && (
                        <StyledListItemIcon>
                            <Iconify
                                sx={{width: "100%", height: "100%"}}
                                icon={icon}
                            />
                        </StyledListItemIcon>
                    )}

                    <ListItemText disableTypography primary={title} />

                    <Box
                        sx={{width: 16, height: 16, ml: 1}}
                        icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
                        component={Icon}
                    />
                </StyledListItem>

                <Collapse in={Boolean(open)} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {children.map((item) => {
                            const {key, title, path} = item;
                            const activeChild = match(path);

                            return (
                                <StyledListItem
                                    key={key}
                                    component={RouterLink}
                                    activeChild={activeChild}
                                    to={path}>
                                    <StyledListItemIcon>
                                        <DotIcon active={activeChild} />
                                    </StyledListItemIcon>

                                    <ListItemText
                                        disableTypography
                                        primary={title}
                                    />
                                </StyledListItem>
                            );
                        })}
                    </List>
                </Collapse>
            </React.Fragment>
        );
    }

    return (
        <StyledListItem
            component={RouterLink}
            activeRoot={activeRoot}
            to={path}>
            {icon && (
                <StyledListItemIcon>
                    <Iconify sx={{width: "100%", height: "100%"}} icon={icon} />
                </StyledListItemIcon>
            )}

            <StyledListItemText disableTypography primary={title} />
        </StyledListItem>
    );
}

NavItem.propTypes = {
    item: PropTypes.object,
    match: PropTypes.func
};

function NavSection({config, ...other}) {
    const {pathname} = useLocation();

    const match = useCallback(
        (pattern) => !isNull(matchPath(`${pattern}/*`, pathname)),
        [pathname]
    );

    return (
        <Box {...other}>
            {config.map((list) => {
                const {key, title, items} = list;

                const filtered = items.filter((e) => !isEmpty(e));

                if (!isEmpty(filtered)) {
                    return (
                        <List key={key} disablePadding sx={{px: 2}}>
                            <StyledListSubheader disableSticky>
                                {title}
                            </StyledListSubheader>

                            {filtered.map((item) => (
                                <NavItem
                                    key={item.key}
                                    item={item}
                                    match={match}
                                />
                            ))}
                        </List>
                    );
                }
            })}
        </Box>
    );
}

NavSection.propTypes = {config: PropTypes.array};

export default NavSection;
