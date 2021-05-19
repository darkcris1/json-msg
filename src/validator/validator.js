import { isArrayEmpty, isFunction, isRegExp, isString } from "../is";
import { defaultMsg } from "../messages";
import { mainValidator } from "./validatorConfigs";
import { refMerge } from "../utils";
export function extend(obj) {
  refMerge(this, obj);
}

export function use() {
  this.push(...arguments);
}

export function handleErrors(errors, fnConfigs, validatorConfig, msgConfig) {
  const {
    key,
    keyValue,
    value,
    typeObj: { messages },
  } = fnConfigs;
  const errMsg = defaultMsg(messages[key], msgConfig);

  function handleValidator(validator) {
    if (isFunction(validator)) {
      const result = validator(fnConfigs);
      if (isString(result)) {
        errors.push(defaultMsg(result, msgConfig));
      } else if (!result) {
        errors.push(errMsg);
      }
    } else if (isRegExp(validator) && !validator.test(value)) {
      errors.push(errMsg);
    }
  }
  if (key in validatorConfig) return handleValidator(validatorConfig[key]);

  // If the key is not exist on the ValidatorConfig
  handleValidator(keyValue);
}

export function commonValidator(validatorConfig) {
  const plugins = [];
  function validate(value, typeObj) {
    const { allow, label, config, data, validationConfig } = typeObj;
    const errors = [];
    const { showAllErrors } = validationConfig;
    if (allow && allow.includes(value)) return null;

    plugins.forEach((plugin) => {
      value = plugin({ value, typeObj });
    });

    for (let key in config) {
      const keyValue = config[key];
      const fnConfigs = { key, keyValue, typeObj, value, data };
      const msgConfig = { label, keyValue, value };
      if (key === "required" && !keyValue && !mainValidator.required(fnConfigs))
        return null;

      handleErrors(errors, fnConfigs, validatorConfig, msgConfig);

      if (!showAllErrors && !isArrayEmpty(errors)) {
        return errors[0];
      }
    }

    return isArrayEmpty(errors) ? null : errors;
  }

  validate.extend = extend.bind(validatorConfig);
  validate.use = use.bind(plugins);

  return validate;
}
