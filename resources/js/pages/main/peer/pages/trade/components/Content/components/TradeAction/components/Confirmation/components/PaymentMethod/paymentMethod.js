import React, {useContext} from "react";
import PeerTradeContext from "contexts/PeerTradeContext";
import {IconButton, Stack, Typography} from "@mui/material";
import handIcon from "@iconify-icons/ri/hand-coin-fill";
import Popup from "components/Popup";
import HelpIcon from "@mui/icons-material/Help";
import {styled} from "@mui/material/styles";
import Iconify from "components/Iconify";

const PaymentMethod = () => {
    const {trade} = useContext(PeerTradeContext);
    const method = trade.payment_method;

    return (
        <Stack
            direction="row"
            sx={{px: 2.5, py: 0.5}}
            alignItems="center"
            spacing={2}>
            <StyledIcon icon={handIcon} />

            <Typography
                variant="body2"
                sx={{flexGrow: 1, maxWidth: 150}}
                noWrap>
                {method.name}
            </Typography>

            {method.description && (
                <Popup
                    component={IconButton}
                    content={method.description}
                    size="small">
                    <HelpIcon fontSize="inherit" />
                </Popup>
            )}
        </Stack>
    );
};

const StyledIcon = styled(Iconify)(({theme}) => ({
    height: 20,
    width: 20,
    color: theme.palette.text.secondary,
    flexShrink: 0
}));

export default PaymentMethod;
