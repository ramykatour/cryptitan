const path = require("path");

module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "commonjs": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react-hooks/recommended",
        "plugin:react/recommended",
        "prettier"
    ],
    "ignorePatterns": ["vendor/*"],
    "plugins": [
        "react",
        "react-hooks",
        "formatjs",
    ],
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "babelOptions": {
            "configFile": path.resolve(__dirname, "babel.config.js")
        },
    },
    "rules": {
        "no-array-constructor": "error",
        "no-lonely-if": "warn",
        "no-multi-assign": "warn",
        "no-plusplus": ["warn", {"allowForLoopAfterthoughts": true}],
        "no-unneeded-ternary": "warn",
        "curly": "warn",
        "no-duplicate-imports": "error",
        "no-useless-computed-key": "warn",
        "no-useless-constructor": "warn",
        "no-useless-rename": "warn",
        "no-var": "error",
        "object-shorthand": "warn",
        "prefer-rest-params": "warn",
        "eqeqeq": "error",
        "yoda": "error",
        "no-eval": "error",
        "no-implied-eval": "error",
        "no-constructor-return": "error",
        "no-caller": "error",
        "no-invalid-this": "error",
        "no-multi-str": "error",
        "guard-for-in": "warn",
        "no-alert": "warn",
        "no-iterator": "warn",
        "no-unused-vars": ["warn", {"ignoreRestSiblings": true, "argsIgnorePattern": "^_", "args": "none"}],
        "no-implicit-coercion": "warn",
        "no-new-wrappers": "warn",
        "no-return-assign": "warn",
        "no-self-compare": "warn",
        "no-unused-expressions": "warn",
        "no-useless-call": "warn",
        "no-useless-concat": "warn",
        "no-useless-return": "warn",
        "require-await": "warn",
        "no-prototype-builtins": "off",
        "prefer-arrow-callback": "warn",
        "spaced-comment": "warn",
        "prefer-const": "warn",
        "formatjs/no-offset": "error",
        "react/prop-types": "off",
        "react/display-name": "off",
        "react/jsx-no-useless-fragment": "warn",
        "react/jsx-fragments": ["warn", "element"],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
    },
    "globals": {
        "Mix": "readonly",
        "context": "readonly"
    },
    "settings": {
        "react": {
            "version": 'detect',
        },
    },
}
