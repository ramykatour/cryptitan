import React, {forwardRef, useImperativeHandle, useMemo} from "react";
import FieldForm from "rc-field-form";
import useForm from "./hooks/useForm";
import {FormContext} from "./contexts";

const Form = forwardRef((props, ref) => {
    const {
        className,
        form,
        onFinishFailed = () => {},
        name,
        ...otherProps
    } = props;

    const [wrapForm] = useForm(form);
    const context = useMemo(() => ({name, form}), [name, form]);

    wrapForm.__INTERNAL__.name = name;

    useImperativeHandle(ref, () => wrapForm);

    return (
        <FormContext.Provider value={context}>
            <FieldForm
                id={name}
                {...otherProps}
                onFinishFailed={onFinishFailed}
                name={name}
                className={className}
                form={wrapForm}
            />
        </FormContext.Provider>
    );
});

export {useForm};
export default Form;
