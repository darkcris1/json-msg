import { isFloat, isInt } from "../is";
import { commonValidator } from "./validator";
import { mainValidator, minAndMaxValidator } from "./validatorConfigs";

const numberValidator = {
  ...mainValidator,
  ...minAndMaxValidator,
  alphanum: ({ value }) => /^[A-Za-z0-9]$/.test(value),
  integer: ({ value }) => isInt(value),
  float: ({ value }) => isFloat(value),
  digit: ({ value, keyValue }) => RegExp(`^[\\d]{${keyValue}}?$`).test(value),
};

export const number = commonValidator(numberValidator);
