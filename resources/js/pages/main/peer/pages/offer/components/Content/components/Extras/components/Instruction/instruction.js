import React, {useContext} from "react";
import {Box, Typography} from "@mui/material";
import PeerOfferContext from "contexts/PeerOfferContext";

const Instruction = () => {
    const {offer} = useContext(PeerOfferContext);

    return (
        <Box sx={{p: 3}}>
            <Typography variant="body2" sx={{whiteSpace: "pre-wrap"}}>
                {offer.instruction}
            </Typography>
        </Box>
    );
};

export default Instruction;
