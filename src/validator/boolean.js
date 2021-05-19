import { commonValidator } from "./validator";
import { mainValidator } from "./validatorConfigs";

const booleanValidator = {
  ...mainValidator,
};

export const boolean = commonValidator(booleanValidator);
