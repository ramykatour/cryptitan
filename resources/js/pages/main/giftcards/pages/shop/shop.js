import React, {forwardRef, Fragment, useCallback, useRef} from "react";
import {Grid, Skeleton, Stack} from "@mui/material";
import {route} from "services/Http";
import InfiniteLoader from "components/InfiniteLoader";
import ShopItem from "./components/ShopItem";
import ShopFilter from "./components/ShopFilter";
import ShopSorter from "./components/ShopSorter";
import ShopCart from "./components/ShopCart";
import {FormattedMessage} from "react-intl";
import Result from "components/Result";

const Shop = () => {
    const loaderRef = useRef();

    const applyFilters = useCallback((filters) => {
        loaderRef.current?.applyFilters(filters);
    }, []);

    const applySorters = useCallback((sorters) => {
        loaderRef.current?.applySorters(sorters);
    }, []);

    return (
        <Fragment>
            <Stack
                direction="row"
                justifyContent="flex-end"
                flexWrap="wrap-reverse"
                spacing={1}
                alignItems="center"
                sx={{mb: 5}}>
                <ShopFilter applyFilters={applyFilters} />
                <ShopSorter applySorters={applySorters} />
            </Stack>

            <Grid container spacing={3}>
                <InfiniteLoader
                    ref={loaderRef}
                    url={route("giftcard.paginate")}
                    renderItem={(item) => (
                        <ShopItem key={item.id} item={item} />
                    )}
                    renderEmpty={() => (
                        <Grid item xs={12}>
                            <Result
                                title={
                                    <FormattedMessage defaultMessage="No giftcards yet." />
                                }
                                description={
                                    <FormattedMessage defaultMessage="We are working on it, please check back later." />
                                }
                            />
                        </Grid>
                    )}
                    renderSkeleton={(ref) => <ShopLoader ref={ref} />}
                />
            </Grid>

            <ShopCart />
        </Fragment>
    );
};

const ShopLoader = forwardRef((props, ref) => {
    return [...Array(4)].map((_, index) => (
        <Grid
            key={index}
            ref={index !== 0 ? undefined : ref}
            {...{xs: 6, sm: 4, md: 3}}
            item>
            <Skeleton
                variant="rectangular"
                sx={{borderRadius: 2}}
                height={250}
                width="100%"
            />
        </Grid>
    ));
});

export default Shop;
