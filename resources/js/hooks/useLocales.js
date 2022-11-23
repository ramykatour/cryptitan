import {useDispatch, useSelector} from "react-redux";
import {get} from "lodash";
import {useCallback} from "react";
import {updateLocale} from "redux/slices/settings";

export default function useLocales() {
    const dispatch = useDispatch();

    const locale = useSelector((state) => {
        return get(state, "settings.locale.data.locale");
    });

    const locales = useSelector((state) => {
        return get(state, "settings.locales");
    });

    const setLocale = useCallback(
        (locale) => dispatch(updateLocale(locale)),
        [dispatch]
    );

    return {setLocale, current: locales[locale], locales};
}
