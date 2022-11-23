import React, {Fragment, useMemo, useState} from "react";
import PropTypes from "prop-types";
import {Box, Divider, Tab, Tabs} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import {useTheme} from "@mui/material/styles";

const CardTabs = ({
    variant = "fullWidth",
    tabs,
    disableSwipe = true,
    ...otherProps
}) => {
    const theme = useTheme();
    const [value, setValue] = useState(0);

    const tabHeader = useMemo(
        () =>
            tabs.map(({component, ...props}, key) => (
                <Tab key={key} sx={{px: 2}} {...props} />
            )),
        [tabs]
    );

    const tabContent = useMemo(
        () =>
            tabs.map((tab, key) => (
                <Box key={key} component="div">
                    {value === key && tab.component}
                </Box>
            )),
        [tabs, value]
    );

    return (
        <Fragment>
            <Tabs
                {...otherProps}
                variant={variant}
                sx={{bgcolor: "background.neutral"}}
                onChange={(e, v) => setValue(v)}
                value={value}>
                {tabHeader}
            </Tabs>

            <Divider />

            <SwipeableViews
                disabled={disableSwipe}
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                onChangeIndex={(v) => setValue(v)}
                index={value}>
                {tabContent}
            </SwipeableViews>
        </Fragment>
    );
};

CardTabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
    variant: PropTypes.string,
    disableSwipe: PropTypes.bool
};

export default CardTabs;
