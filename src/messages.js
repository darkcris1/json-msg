export const initialMsg = {
  number: {
    type: "%label% must be a number",
    min: "%label% must be greater than %keyValue%",
    max: "%label% must be less than %keyValue%",
    integer: "%label% must be an integer",
    float: "%label% must be a float number",
    digit: "%label% must be %keyValue% digit number",
  },
  string: {
    type: "%label% must be a string",
    min: "%label% characters length must be greater than %keyValue%",
    max: "%label% characters length must be less than %keyValue%",
    email: "%label% must be a valid email",
    alphanum: "%label% must contain letters and numbers only",
    number: "%label% must have atleast %keyvalue% number",
    uppercase: "%label% must have atleast %keyValue% uppercase",
  },
  array: {
    type: "%label% must be an array",
    min: "%label% must contain atleast %keyValue% items",
    max: "%label% must contain maximum of %keyValue% items",
    items: "All items must be match of the type",
  },
  boolean: {
    type: "%label% must be a boolean",
  },
  file: {
    type: "%label% must be a file",
    maxSize: "%label% must be less than %keyValue% bytes",
    minSize: "%label% must be greater than %keyValue% bytes",
  },
  object: {
    type: "%label% must be an object",
  },
  sameAs: "%label% must be the same as %keyValue%",
  404: "%label% is not part of schema",
};

export function defaultMessage(msg = {}) {
  for (let key in msg) {
    if (!(key in initialMsg)) continue;
    initialMsg[key] = { ...initialMsg[key], ...msg[key] };
  }
}

const defaultLabel = "This";
const defaultErrorMsg = "%label% is invalid";

export function defaultMsg(
  msg = defaultErrorMsg,
  { label = defaultLabel, value = "", keyValue = "" }
) {
  return msg
    .replace("%value%", value)
    .replace("%label%", label)
    .replace("%keyValue%", keyValue);
}
