import React, {
    forwardRef,
    Fragment,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState
} from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import {useRequest} from "services/Http";
import {clone, defaultTo, get, isEmpty} from "lodash";

const InfiniteLoader = forwardRef((props, ref) => {
    const {
        url,
        initialPageSize = 10,
        getItemId = (row) => row.id,
        onItemsChange,
        reverse = false,
        renderItem,
        renderSkeleton,
        renderEmpty
    } = props;

    const [request, loading] = useRequest();
    const [pageSize] = useState(initialPageSize);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [items, setItems] = useState([]);
    const [filters, setFilters] = useState([]);
    const [sorters, setSorters] = useState([]);
    const [search, setSearch] = useState({});

    useEffect(() => {
        onItemsChange?.(items);
    }, [onItemsChange, items]);

    const fetchItems = useCallback(() => {
        request
            .post(url, {
                page,
                itemPerPage: pageSize,
                filters,
                sorters,
                search
            })
            .then((response) => {
                setItems((items) => {
                    return page !== 1
                        ? items.concat(response.data)
                        : response.data;
                });

                setHasNextPage(() => {
                    const currentPage = defaultTo(
                        get(response, "meta.current_page"),
                        get(response, "current_page")
                    );

                    const lastPage = defaultTo(
                        get(response, "meta.last_page"),
                        get(response, "last_page")
                    );

                    return currentPage < lastPage;
                });
            })
            .catch((error) => {
                if (!error.canceled) {
                    setHasNextPage(false);
                }
            });
    }, [request, page, pageSize, filters, sorters, search, url]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    useImperativeHandle(ref, () => {
        return {
            resetPage() {
                if (page !== 1) {
                    setPage(1);
                } else {
                    fetchItems();
                }
            },

            applyFilters(filters) {
                setFilters(filters);
                setPage(1);
            },

            applySorters(sorters) {
                setSorters(sorters);
                setPage(1);
            },

            applySearch(search) {
                setSearch((state) => ({...state, ...search}));
                setPage(1);
            },

            clearSearch() {
                setSearch({});
                setPage(1);
            }
        };
    });

    const updateHandler = useCallback(
        (item) => {
            return (newItem) => {
                setItems((state) => {
                    const items = [...state];

                    const index = items.findIndex((o) => {
                        return getItemId(o) === getItemId(item);
                    });

                    if (index >= 0) {
                        items.splice(index, 1, newItem);
                    }
                    return items;
                });
            };
        },
        [getItemId]
    );

    const deleteHandler = useCallback(
        (item) => {
            return () => {
                setItems((state) => {
                    const items = [...state];

                    const index = items.findIndex((o) => {
                        return getItemId(o) === getItemId(item);
                    });

                    if (index >= 0) {
                        items.splice(index, 1);
                    }
                    return items;
                });
            };
        },
        [getItemId]
    );

    const onLoadMore = useCallback(() => {
        setPage((page) => page + 1);
    }, []);

    const options = useMemo(
        () => ({
            loading,
            hasNextPage,
            onLoadMore
        }),
        [loading, hasNextPage, onLoadMore]
    );

    const [sentryRef] = useInfiniteScroll(options);

    const showEmpty = !hasNextPage && isEmpty(items);

    return (
        <Fragment>
            {reverse && hasNextPage && renderSkeleton?.(sentryRef)}

            {(reverse ? clone(items).reverse() : items).map((i) => {
                return renderItem?.(i, updateHandler(i), deleteHandler(i));
            })}

            {!reverse && hasNextPage && renderSkeleton?.(sentryRef)}

            {showEmpty && renderEmpty?.()}
        </Fragment>
    );
});

export default InfiniteLoader;
