import { isEmail, isString } from "../is";
import { commonValidator } from "./validator";
import { mainValidator, minAndMaxValidator } from "./validatorConfigs";

const stringValidator = {
  ...mainValidator,
  ...minAndMaxValidator,
  alphanum: ({ value }) => /^[A-Za-z0-9]+$/.test(value),
  email: ({ value }) => isEmail(value),
  number: ({ value, keyValue }) => RegExp(`[0-9]{${keyValue},}`).test(value),

  uppercase: ({ value, keyValue }) => RegExp(`[A-Z]{${keyValue},}`).test(value),
};

export const string = commonValidator(stringValidator);

string.use(({ value, typeObj }) => {
  const config = typeObj.config;

  if (isString(value) && config.trim) {
    delete typeObj.config.trim;
    return value.trim();
  }
  return value;
});
