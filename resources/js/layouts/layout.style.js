import {alpha, experimentalStyled as styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const OFFSET_MOBILE = 64;
const OFFSET_DESKTOP = 92;
const NAVBAR_WIDTH = 280;

export const MainStyle = styled("main")(({theme}) => ({
    flexGrow: 1,
    overflow: "auto",
    paddingBottom: OFFSET_MOBILE + 24,
    paddingTop: OFFSET_MOBILE + 24,
    minHeight: "100%",
    [theme.breakpoints.up("lg")]: {
        width: `calc(100% - ${NAVBAR_WIDTH}px)`,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: OFFSET_DESKTOP + 24,
        paddingBottom: OFFSET_DESKTOP + 24
    }
}));

export const BaseStyle = styled("div")({
    display: "flex",
    minHeight: "100%",
    overflow: "hidden"
});

export const DocStyle = styled(Box)(({theme}) => ({
    padding: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor:
        theme.palette.mode === "light"
            ? alpha(theme.palette.primary.main, 0.08)
            : theme.palette.primary.lighter
}));
