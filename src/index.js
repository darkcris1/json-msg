import * as types from "./types";
import { defaultMessage } from "./messages";
import { validate, validateAsync } from "./validator/validate";
import * as validators from "./validator/index";

const jm = {
  ...types,
  defaultMessage,
  validate,
  validateAsync,
  validators,
};
export default jm;
