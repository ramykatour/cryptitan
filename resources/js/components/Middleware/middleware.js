import {useAuth} from "models/Auth";
import {pipe} from "utils/helpers";
import PropTypes from "prop-types";

const Middleware = ({rules = [], children: node}) => {
    const auth = useAuth();
    rules = [].concat(rules).reverse();
    const show = (n) => n;

    return pipe(...rules)(show)(node, auth);
};

Middleware.propTypes = {
    rules: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
    children: PropTypes.node.isRequired
};

export default Middleware;
