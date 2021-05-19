import { isEmpthyObj, isJMType, isObj } from "../is";
import { defaultMsg, initialMsg } from "../messages";
import * as validator from "./index";

const checkShowAll = (errMsg, showAllErrors) =>
  showAllErrors ? [errMsg] : errMsg;

function assertError(msg) {
  throw new Error("JSON-MSG-ERROR->:" + msg);
}
function checkNotPartOfSchema({ data, schema, errors = {}, validationConfig }) {
  const { abortEarly, showAllErrors } = validationConfig;
  for (let label in data) {
    if (isObj(schema[label]) && isObj(data[label])) {
      const errorMsg = _checkNotPartOfSchema(
        data[label],
        schema[label],
        errors[label]
      );
      if (!isEmpthyObj(errorMsg)) errors[label] = errorMsg;
      continue;
    }
    if (label in schema) continue;
    const errMsg = defaultMsg(initialMsg[404], { label });

    errors[label] = checkShowAll(errMsg, showAllErrors);
    if (abortEarly) return errors;
  }
}
function checkErrors(config) {
  let { data, schema, errors, validationConfig } = config;
  const { abortEarly, strict } = validationConfig;

  for (const key in schema) {
    const value = data[key];
    const typeObj = schema[key];
    const label = typeObj.label || key;
    const errorMsg = validateSingle(value, {
      ...typeObj,
      label,
      data,
      validationConfig,
    });

    if (errorMsg) {
      errors[key] = errorMsg;
      if (abortEarly) return errors;
    }
  }

  strict && checkNotPartOfSchema(config);

  return isEmpthyObj(errors) ? null : errors;
}

function validateSingle(value, typeObj) {
  const {
    validationConfig: { showAllErrors },
    config,
  } = typeObj;
  if (!isObj(value) && !isJMType(typeObj)) {
    const errMsg = defaultMsg(initialMsg.object.type, typeObj);
    return checkShowAll(errMsg, showAllErrors);
  }

  const type = config.type;

  if (validator.__valNames.includes(type))
    return validator[type](value, typeObj);

  assertError("Make sure you use JSON-MSG Types");
}

const defaultValidationConfig = {
  abortEarly: true,
  showAllErrors: false,
};

export function validate(data, schema, validationConfig) {
  validationConfig = { ...defaultValidationConfig, ...validationConfig };
  if (isObj(data) && !isJMType(schema))
    return checkErrors({ data, schema, validationConfig, errors: {} });

  if (isJMType(schema) && schema.config.type === "sameas")
    assertError("jm.sameAs() Cannot be use in Single Validation");
  return validateSingle(data, {
    ...schema,
    validationConfig,
  });
}

export function validateAsync(data, schema, validationConfig) {
  return new Promise((resolve, reject) => {
    const errors = validate(data, schema, validationConfig);
    if (errors) reject(errors);
    resolve(null);
  });
}
