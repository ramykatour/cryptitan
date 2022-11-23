import {useEffect, useMemo} from "react";
import {debounce} from "lodash";

export function useSearchDebounce(value, search, clear) {
    const applySearch = useMemo(() => {
        return debounce(search, 500);
    }, [search]);

    const clearSearch = useMemo(() => {
        return debounce(clear, 500);
    }, [clear]);

    useEffect(() => {
        if (value) {
            applySearch(value);
        } else {
            clearSearch();
        }
    }, [value, applySearch, clearSearch]);
}
