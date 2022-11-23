import React, {useMemo, useState} from "react";
import {Container, Grid} from "@mui/material";
import Table from "./components/Table";
import Filter from "./components/Filter";
import PropTypes from "prop-types";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";
import Page from "components/Page";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
    sell: {defaultMessage: "Sell Crypto"},
    buy: {defaultMessage: "Buy Crypto"}
});

const Offers = ({type}) => {
    const intl = useIntl();
    const [filters, setFilters] = useState();

    const title = useMemo(() => {
        return type === "buy"
            ? intl.formatMessage(messages.sell)
            : intl.formatMessage(messages.buy);
    }, [type, intl]);

    return (
        <Page title={title}>
            <Container>
                <HeaderBreadcrumbs />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Table type={type} filters={filters} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Filter apply={setFilters} />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

Offers.propTypes = {
    type: PropTypes.oneOf(["buy", "sell"])
};

export default Offers;
