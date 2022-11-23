import React from "react";
import {alpha, experimentalStyled as styled} from "@mui/material/styles";
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader
} from "@mui/material";

export const StyledListSubheader = styled((props) => (
    <ListSubheader disableSticky disableGutters {...props} />
))(({theme}) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    color: theme.palette.text.primary
}));

export const StyledListItem = styled((props) => {
    const {activeRoot, activeChild, ...otherProps} = props;
    return <ListItem button disableGutters {...otherProps} />;
})(({activeRoot, activeChild, theme}) => ({
    ...theme.typography.body2,
    height: 48,
    textTransform: "capitalize",
    position: "relative",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1.5),
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
    ...(activeRoot && {
        ...theme.typography.subtitle2,
        backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
        ),
        color: theme.palette.primary.main
    }),
    ...(activeChild && {
        ...theme.typography.subtitle2,
        color: theme.palette.text.primary
    })
}));

export const StyledListItemIcon = styled(ListItemIcon)({
    height: 22,
    width: 22,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& svg": {
        width: "100%",
        height: "100%"
    }
});

export const StyledListItemText = styled(ListItemText)({
    whiteSpace: "nowrap"
});
