import { commonValidator } from "./validator";
import { mainValidator } from "./validatorConfigs";

const fileValidator = {
  ...mainValidator,
  maxSize: ({ value, keyValue }) => value.size <= keyValue,
  minSize: ({ value, keyValue }) => value.size >= keyValue,
};

export const file = commonValidator(fileValidator);
