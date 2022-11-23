import {alpha} from "@mui/material/styles";

const cssStyle = (theme) => ({
    bgBlur: (props) => {
        const blurRate = props?.blur || 6;
        const color = props?.color || theme.palette.background.default;
        const opacity = props?.opacity || 0.8;

        return {
            backdropFilter: `blur(${blurRate}px)`,
            WebkitBackdropFilter: `blur(${blurRate}px)`,
            backgroundColor: alpha(color, opacity)
        };
    }
});

export default cssStyle;
