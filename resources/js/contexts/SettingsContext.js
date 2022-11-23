import React, {createContext, useCallback, useState} from "react";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import getColorPresets, {
    colorPresets,
    defaultPreset
} from "../theme/colorPresets";
import {get} from "lodash";
import {errorHandler, route, useRequest} from "services/Http";

const initialState = {
    themeMode: "dark",
    themeDirection: "ltr",
    themeColor: "default",
    themeStretch: false,

    // Mode
    onToggleMode: () => {},
    onChangeMode: () => {},

    // Direction
    onToggleDirection: () => {},
    onChangeDirection: () => {},

    // Color
    onChangeColor: () => {},
    activeColor: defaultPreset,
    colorOption: [],

    // Stretch
    onToggleStretch: () => {}
};

const SettingsContext = createContext(initialState);

function SettingsProvider({children}) {
    const [request] = useRequest();

    const saved = useSelector((state) => {
        return get(state, "settings.theme");
    });

    const [settings, setSettings] = useState({
        themeMode: saved.mode,
        themeDirection: saved.direction,
        themeColor: saved.color,
        themeStretch: initialState.themeStretch
    });

    const saveSettings = useCallback(
        (name, value) => {
            request.post(route(name), {value}).catch(errorHandler());
        },
        [request]
    );

    // MODE
    const onChangeMode = (mode) => {
        setSettings({...settings, themeMode: mode});
        saveSettings("admin.theme.set-mode", mode);
    };

    const onToggleMode = () => {
        const mode = settings.themeMode === "light" ? "dark" : "light";
        setSettings({...settings, themeMode: mode});
    };

    // DIRECTION
    const onChangeDirection = (direction) => {
        setSettings({...settings, themeDirection: direction});
        saveSettings("admin.theme.set-direction", direction);
    };

    // COLOR
    const onChangeColor = (color) => {
        setSettings({...settings, themeColor: color});
        saveSettings("admin.theme.set-color", color);
    };

    // STRETCH
    const onToggleStretch = () => {
        setSettings({...settings, themeStretch: !settings.themeStretch});
    };

    return (
        <SettingsContext.Provider
            value={{
                ...settings,
                // MODE
                onToggleMode,
                onChangeMode,

                // DIRECTION
                onChangeDirection,

                // STRETCH
                onToggleStretch,

                // COLOR
                onChangeColor,

                activeColor: getColorPresets(settings.themeColor),
                colorOption: colorPresets.map((color) => ({
                    name: color.name,
                    value: color.main
                }))
            }}>
            {children}
        </SettingsContext.Provider>
    );
}

SettingsProvider.propTypes = {children: PropTypes.node};

export {SettingsProvider, SettingsContext};
