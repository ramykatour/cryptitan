import React from "react";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {SettingsProvider} from "contexts/SettingsContext";
import ThemeOverride from "theme";
import PropTypes from "prop-types";
import NotistackProvider from "components/NotistackProvider";
import RtlLayout from "components/RtlLayout";
import DayjsAdapter from "@mui/lab/AdapterDayjs";
import {dayjs} from "utils/index";
import MotionLazyContainer from "components/Animate/MotionLazyContainer";

const MuiBootstrap = ({children}) => {
    return (
        <MotionLazyContainer>
            <LocalizationProvider
                dateAdapter={DayjsAdapter}
                dateLibInstance={dayjs}
                locale={"en"}>
                <SettingsProvider>
                    <ThemeOverride>
                        <RtlLayout>
                            <NotistackProvider>{children}</NotistackProvider>
                        </RtlLayout>
                    </ThemeOverride>
                </SettingsProvider>
            </LocalizationProvider>
        </MotionLazyContainer>
    );
};

MuiBootstrap.propTypes = {children: PropTypes.node};

export default MuiBootstrap;
