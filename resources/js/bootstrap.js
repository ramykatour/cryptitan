import React, {useEffect} from "react";
import {HelmetProvider} from "react-helmet-async";
import {useIntl} from "react-intl";
import {getValidationMessages} from "utils/form";
import MuiBootstrap from "components/MuiBootstrap";
import context, {AppContext} from "context";
import Form from "components/Form";
import {useInstaller} from "hooks/settings";
import ScrollToTop from "components/ScrollToTop";
import {lazy, notify} from "utils/index";

const Installer = lazy(() =>
    import(/* webpackChunkName: 'installer' */ "./installer")
);

const Bootstrap = ({children}) => {
    const intl = useIntl();
    const showInstaller = useInstaller();

    useEffect(() => {
        const data = context.notification;
        notify[data?.type]?.(data.message);
    }, []);

    return (
        <HelmetProvider>
            <MuiBootstrap>
                <Form.Provider validateMessages={getValidationMessages(intl)}>
                    <AppContext.Provider value={context}>
                        <ScrollToTop />
                        {showInstaller ? <Installer /> : children}
                    </AppContext.Provider>
                </Form.Provider>
            </MuiBootstrap>
        </HelmetProvider>
    );
};

export default Bootstrap;
