import React, {useContext, useMemo} from "react";
import {FormattedMessage} from "react-intl";
import {Button} from "@mui/material";
import PeerOfferContext from "contexts/PeerOfferContext";
import SearchIcon from "@mui/icons-material/Search";
import LoadingContext from "contexts/LoadingContext";
import {LoadingButton} from "@mui/lab";
import {Link as RouterLink} from "react-router-dom";
import router from "router/router";

const ActionButton = () => {
    const {offer} = useContext(PeerOfferContext);
    const loading = useContext(LoadingContext);

    const link = useMemo(() => {
        return offer.isBuyOffer()
            ? router.generatePath("main.peer.sell-crypto")
            : router.generatePath("main.peer.buy-crypto");
    }, [offer]);

    return offer.tradable ? (
        <LoadingButton
            size="large"
            variant="contained"
            type="submit"
            loading={loading}
            fullWidth>
            {offer.isBuyOffer() ? (
                <FormattedMessage defaultMessage="Sell Now" />
            ) : (
                <FormattedMessage defaultMessage="Buy Now" />
            )}
        </LoadingButton>
    ) : (
        <Button
            size="large"
            component={RouterLink}
            startIcon={<SearchIcon />}
            variant="outlined"
            to={link}
            fullWidth>
            <FormattedMessage defaultMessage="Similar Offers" />
        </Button>
    );
};

export default ActionButton;
