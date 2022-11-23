import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {defineMessages, useIntl} from "react-intl";
import {fetchPaymentAccount} from "redux/slices/payment";
import Page from "components/Page";
import {Container} from "@mui/material";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";
import router from "router";
import {Navigate, Route, Routes} from "react-router-dom";
import Shop from "./pages/shop";
import Checkout from "./pages/checkout";
import Result404 from "components/Result404";

const messages = defineMessages({
    title: {defaultMessage: "Giftcards"}
});

const Giftcards = () => {
    const dispatch = useDispatch();
    const intl = useIntl();

    useEffect(() => {
        dispatch(fetchPaymentAccount());
    }, [dispatch]);

    const indexRoute = router.getRoutePath("main.giftcards.shop");

    return (
        <Page title={intl.formatMessage(messages.title)}>
            <Container>
                <HeaderBreadcrumbs />

                <Routes>
                    <Route index element={<Navigate to={indexRoute} />} />

                    <Route
                        path={router.getRoutePath("main.giftcards.checkout")}
                        element={<Checkout />}
                    />

                    <Route
                        path={router.getRoutePath("main.giftcards.shop")}
                        element={<Shop />}
                    />

                    <Route path="*" element={<Result404 />} />
                </Routes>
            </Container>
        </Page>
    );
};

export default Giftcards;
