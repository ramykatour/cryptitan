import React from "react";
import PropTypes from "prop-types";
import {Grid, Stack, Typography} from "@mui/material";

const ItemDetail = ({title, content, inverse = false, sx}) => {
    const neutral = {bgcolor: "background.neutral"};

    return (
        <Stack sx={{...(inverse && neutral), ...sx}} p={3}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Typography
                        variant="body2"
                        color="text.primary"
                        component="div">
                        {title}
                    </Typography>
                </Grid>

                <Grid item xs={8}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        component="div">
                        {content}
                    </Typography>
                </Grid>
            </Grid>
        </Stack>
    );
};

ItemDetail.propTypes = {
    inverse: PropTypes.bool,
    title: PropTypes.any,
    content: PropTypes.any
};

export default ItemDetail;
