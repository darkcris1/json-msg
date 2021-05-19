import { commonValidator } from "./validator";
import { mainValidator } from "./validatorConfigs";
import { getPath } from "../utils";
const sameAsValidator = {
  ...mainValidator,
  sameAs: ({ value, keyValue, data }) => getPath(keyValue, data) === value,
};

export const sameas = commonValidator(sameAsValidator);
