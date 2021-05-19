import { JM_ARRAY_MSG_KEY, isArrayEmpty } from "../is";
import { handleErrors, extend, use } from "./validator";
import { mainValidator } from "./validatorConfigs";
import { validate } from "./validate";

function objectValidator(validatorConfig) {
  const plugins = [];
  function validator(value, typeObj) {
    const { allow, label, config, validationConfig, data } = typeObj;
    const { showAllErrors } = validationConfig;
    const errors = [];

    if (allow && allow.includes(value)) return null;

    plugins.forEach((plugin) => {
      value = plugin({ value, typeObj });
    });
    function setArrMsg(msg) {
      arrayMsgError.message = msg;
    }
    for (let key in config) {
      const keyValue = config[key];
      const fnConfigs = { key, keyValue, typeObj, value, data };
      const msgConfig = { label, keyValue, value };

      if (key === "required" && !keyValue && !mainValidator.required(fnConfigs))
        return null;

      if (key === "shape") return validate(value, keyValue, validationConfig);

      handleErrors(errors, fnConfigs, validatorConfig, msgConfig);
      const isErrorNotEmpty = !isArrayEmpty(errors);

      if (!showAllErrors && isErrorNotEmpty) return errors[0];

      if (key === "type" && isErrorNotEmpty) break;
    }

    return isArrayEmpty(errors) ? null : errors;
  }

  validator.extend = extend.bind(validatorConfig);
  validator.use = use.bind(plugins);
  return validator;
}

const objectValidatorConfig = {
  ...mainValidator,
};

export const object = objectValidator(objectValidatorConfig);
