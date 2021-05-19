import { JM_ARRAY_MSG_KEY, isArray, isArrayEmpty } from "../is";
import { handleErrors, extend, use } from "./validator";
import { mainValidator, minAndMaxValidator } from "./validatorConfigs";
import { validate } from "./validate";
import { defaultMsg } from "../messages";

function arrayValidator(validatorConfig) {
  const plugins = [];
  function validator(value, typeObj) {
    const { allow, label, messages, config, validationConfig, data } = typeObj;
    const { showAllErrors } = validationConfig;
    const errors = [];
    const arrayMsgError = { [JM_ARRAY_MSG_KEY]: true };
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
      const errMsg = defaultMsg(messages[key], msgConfig);
      if (key === "required" && !keyValue && !mainValidator.required(fnConfigs))
        return null;

      if (key === "items") {
        const isItemArray = isArray(keyValue);
        let isItemError = false;
        for (let i = 0; i < value?.length; i++) {
          const arrayErrorMsg = validate(
            value[i],
            isItemArray ? keyValue[i] : keyValue,
            validationConfig
          );

          if (arrayErrorMsg) {
            arrayMsgError[i] = arrayErrorMsg;
            isItemError = true;
          }
        }
        if (isItemError) errors.push(errMsg);
        delete validatorConfig.items;
      } else {
        handleErrors(errors, fnConfigs, validatorConfig, msgConfig);
      }

      if (!showAllErrors && !isArrayEmpty(errors)) {
        setArrMsg(errors[0]);
        return arrayMsgError;
      }
    }

    setArrMsg(errors);
    return isArrayEmpty(errors) ? null : arrayMsgError;
  }

  validator.extend = extend.bind(validatorConfig);
  validator.use = use.bind(plugins);
  return validator;
}

const arrayValidatorConfig = {
  ...mainValidator,
  ...minAndMaxValidator,
};

export const array = arrayValidator(arrayValidatorConfig);
