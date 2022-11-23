import React, {createContext} from "react";
import PropTypes from "prop-types";

const initialState = {
    reload: () => {},
    applySearch: () => {},
    clearSearch: () => {},
    applyParams: () => {},
    clearParams: () => {},
    resetPage: () => {},
    selection: [],
    loading: false
};

const TableContext = createContext(initialState);

const TableProvider = ({
    reload,
    applySearch,
    clearSearch,
    applyParams,
    clearParams,
    resetPage,
    selection,
    loading,
    children
}) => {
    return (
        <TableContext.Provider
            value={{
                reload,
                applySearch,
                clearSearch,
                applyParams,
                clearParams,
                resetPage,
                selection,
                loading
            }}>
            {children}
        </TableContext.Provider>
    );
};

TableProvider.propTypes = {
    reload: PropTypes.func,
    applySearch: PropTypes.func,
    clearSearch: PropTypes.func,
    applyParams: PropTypes.func,
    clearParams: PropTypes.func,
    resetPage: PropTypes.func,
    selection: PropTypes.array,
    loading: PropTypes.bool
};

export {TableProvider};
export default TableContext;
