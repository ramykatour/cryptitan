import React, {forwardRef, useImperativeHandle, useRef} from "react";
import {Box} from "@mui/material";

const GridItem = forwardRef((props, ref) => {
    const baseRef = useRef();
    const {component: GridComponent, ...otherProps} = props;

    useImperativeHandle(ref, () => baseRef.current, []);

    return (
        <Box ref={baseRef} {...otherProps}>
            <GridComponent />
        </Box>
    );
});

export default GridItem;
