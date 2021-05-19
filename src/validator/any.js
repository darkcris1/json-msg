import { commonValidator } from "./validator";
import { mainValidator } from "./validatorConfigs";

const anyValidator = {
  required: mainValidator.required,
};

export const any = commonValidator(anyValidator);
