import React, {useContext, useMemo} from "react";
import PeerOfferContext from "contexts/PeerOfferContext";
import Page from "components/Page";
import {FormattedMessage, useIntl} from "react-intl";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";
import {Container, Grid, Stack} from "@mui/material";
import Action from "./components/Action";
import Description from "./components/Description";
import Extras from "./components/Extras";
import Details from "./components/Details";

const Content = () => {
    const intl = useIntl();
    const {offer} = useContext(PeerOfferContext);

    const title = useMemo(() => {
        return offer.title(intl);
    }, [offer, intl]);

    return (
        <Page title={title}>
            <Container>
                <HeaderBreadcrumbs
                    title={
                        offer.isSellOffer() ? (
                            <FormattedMessage
                                defaultMessage="Buy {coin} from {user}"
                                values={offer.titleParams(intl)}
                            />
                        ) : (
                            <FormattedMessage
                                defaultMessage="Sell {coin} to {user}"
                                values={offer.titleParams(intl)}
                            />
                        )
                    }
                />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Stack spacing={3}>
                            <Action />
                            <Description />
                            <Extras />
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            <Details />
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default Content;
