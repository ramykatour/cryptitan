import React from "react";
import PropTypes from "prop-types";
import {LazyMotion} from "framer-motion";

const loadFeatures = () => import("./features.js").then((res) => res.default);

function MotionLazyContainer({children}) {
    return (
        <LazyMotion strict features={loadFeatures}>
            {children}
        </LazyMotion>
    );
}

MotionLazyContainer.propTypes = {
    children: PropTypes.node
};

export default MotionLazyContainer;
