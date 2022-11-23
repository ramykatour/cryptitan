import React from "react";
import useModules from "hooks/useModules";
import PropTypes from "prop-types";
import Result403 from "components/Result403";

const Module = ({module, children}) => {
    const modules = useModules();
    return modules[module] ? children : <Result403 />;
};

Module.propTypes = {
    module: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

export default Module;
