import {
  isArray,
  isBoolean,
  isFile,
  isNumber,
  isObj,
  isString,
  isUndefined,
} from "../is";

const is = {
  object: isObj,
  string: isString,
  array: isArray,
  boolean: isBoolean,
  file: isFile,
  number: isNumber,
};
export const mainValidator = {
  required: ({ value, typeObj }) => {
    const isValueEmpty =
      isUndefined(value) || (typeObj.config.type === "string" && value === "");

    // Return Imediately if the required is false
    return !isValueEmpty;
  },
  type: ({ value, typeObj }) => {
    const type = typeObj.config.type;
    switch (type) {
      case "string":
      case "object":
      case "array":
      case "boolean":
      case "number":
      case "file":
        return is[type](value);
    }
    return true;
  },
};

const checkMinMax = ({ value, typeObj, keyValue, key }) => {
  if (isUndefined(value)) return false;
  const isMin = key === "min";
  switch (typeObj.config.type) {
    case "string":
    case "array":
      if (isMin && value.length < keyValue) return false;
      /// For Max
      else if (!isMin && value.length > keyValue) return false;
      break;
    case "number":
      /// For Max
      if (isMin && value < keyValue) return false;
      else if (!isMin && value > keyValue) return false;
  }
  return true;
};
export const minAndMaxValidator = {
  min: checkMinMax,
  max: checkMinMax,
};
