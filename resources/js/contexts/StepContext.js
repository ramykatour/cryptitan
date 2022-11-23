import React, {createContext} from "react";
import PropTypes from "prop-types";

const initialState = {
    next: () => {},
    prev: () => {},
    loading: false
};

const StepContext = createContext(initialState);

const StepProvider = ({next, prev, loading, children}) => {
    return (
        <StepContext.Provider value={{next, prev, loading}}>
            {children}
        </StepContext.Provider>
    );
};

StepProvider.propTypes = {
    next: PropTypes.func,
    prev: PropTypes.func,
    loading: PropTypes.bool
};

export {StepProvider};
export default StepContext;
