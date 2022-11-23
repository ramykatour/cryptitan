import React, {useEffect} from "react";
import {IntlProvider} from "react-intl";
import {get} from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {fetchLocale} from "redux/slices/settings";

const Localization = ({children}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchLocale());
    }, [dispatch]);

    const {messages, locale} = useSelector((state) => {
        return get(state, "settings.locale.data");
    });

    return (
        <IntlProvider
            locale={locale}
            messages={messages}
            onError={() => null}
            defaultLocale="en">
            {children}
        </IntlProvider>
    );
};

export default Localization;
