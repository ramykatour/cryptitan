import Form, {useForm} from "./form";
import Item from "./item";
import {FormProvider} from "./contexts";
import ControlLabel from "./fields/controlLabel";
import ToggleButtonGroup from "./fields/toggleButtonGroup";
import TextField from "./fields/textField";
import MultiSelect from "./fields/multiSelect";
import DatePicker from "./fields/datePicker";
import DateTimePicker from "./fields/dateTimePicker";
import SelectAdornment from "./fields/selectAdornment";
import Checkbox from "./fields/checkbox";
import AutoComplete from "./fields/autoComplete";
import Input from "./fields/input";
import Rating from "./fields/rating";

Form.Item = Item;
Form.Provider = FormProvider;
Form.useForm = useForm;

export {
    TextField,
    ControlLabel,
    ToggleButtonGroup,
    DatePicker,
    Checkbox,
    MultiSelect,
    DateTimePicker,
    SelectAdornment,
    AutoComplete,
    Input,
    Rating
};
export default Form;
