import React, {createContext} from "react";
import PropTypes from "prop-types";

const initialState = {
    setGroup: () => {}
};

const LocaleContext = createContext(initialState);

const LocaleProvider = ({group, setGroup, children}) => {
    return (
        <LocaleContext.Provider value={{group, setGroup}}>
            {children}
        </LocaleContext.Provider>
    );
};

LocaleProvider.propTypes = {
    group: PropTypes.string,
    setGroup: PropTypes.func
};

export {LocaleProvider};
export default LocaleContext;
