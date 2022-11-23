import React, {useCallback, useState} from "react";
import {Box, Button, Collapse} from "@mui/material";
import forward from "@iconify/icons-eva/arrow-ios-forward-fill";
import downward from "@iconify/icons-eva/arrow-ios-downward-fill";
import PropTypes from "prop-types";
import Iconify from "components/Iconify";
import Scrollbar from "components/Scrollbar";
import {styled} from "@mui/material/styles";

const Collapsible = ({title, content, ...otherProps}) => {
    const [collapse, setCollapse] = useState(true);

    const toggleCollapse = useCallback(() => {
        setCollapse((prev) => !prev);
    }, []);

    return (
        <BaseStyle {...otherProps}>
            <StyledCollapsedButton
                fullWidth
                color="inherit"
                onClick={toggleCollapse}
                disableRipple
                endIcon={
                    <Iconify
                        icon={collapse ? downward : forward}
                        width={16}
                        height={16}
                    />
                }>
                {title}
            </StyledCollapsedButton>

            <Scrollbar>
                <Collapse in={collapse}>
                    <Box sx={{pb: 1}}>{content}</Box>
                </Collapse>
            </Scrollbar>
        </BaseStyle>
    );
};

const BaseStyle = styled(Box)({
    maxHeight: "302px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
});

const StyledCollapsedButton = styled(Button)(({theme}) => ({
    ...theme.typography.overline,
    borderRadius: 0,
    height: 40,
    flexShrink: 0,
    justifyContent: "space-between",
    color: theme.palette.text.disabled,
    padding: theme.spacing(1, 2)
}));

Collapsible.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    content: PropTypes.node.isRequired
};

export default Collapsible;
