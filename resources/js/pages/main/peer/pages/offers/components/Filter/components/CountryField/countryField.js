import React from "react";
import {defineMessages, useIntl} from "react-intl";
import {useCountries} from "hooks/global";
import {isEmpty} from "lodash";
import Form, {TextField} from "components/Form";
import {MenuItem} from "@mui/material";

const messages = defineMessages({
    country: {defaultMessage: "Country"}
});

const CountryField = () => {
    const intl = useIntl();
    const {countries} = useCountries();

    if (isEmpty(countries)) {
        return (
            <Form.Item
                name="country"
                label={intl.formatMessage(messages.country)}>
                <TextField fullWidth disabled />
            </Form.Item>
        );
    }

    return (
        <Form.Item name="country" label={intl.formatMessage(messages.country)}>
            <TextField fullWidth select>
                {countries.map((country) => (
                    <MenuItem value={country.code} key={country.code}>
                        {`${country.name}`}
                    </MenuItem>
                ))}
            </TextField>
        </Form.Item>
    );
};

export default CountryField;
