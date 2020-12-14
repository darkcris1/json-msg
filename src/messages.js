export const initialMsg = {
  number: {
    type: '%label% must be a number',
    min: '%label% must be greater than %keyValue%',
    max: '%label% must be less than %keyValue%',
    integer: '%label% must be an integer',
    float: '%label% must be a float number',
    digit: '%label% must be %keyValue% digit number',
  },
  string: {
    type: '%label% must be a string',
    min: '%label% characters length must be greater than %keyValue%',
    max: '%label% characters length must be less than %keyValue%',
    email: '%label% must be a valid email',
    required: '%label% is required or not allowed to be empty',
    alphanum: '%label% must contain letters and numbers only',
  },
  array: {
    type: '%label% must be an array',
    min: '%label% must contain atleast %keyValue% items',
    max: '%label% must contain maximum of %keyValue% items',
    items: 'All items must be match of the type',
  },
  boolean: {
    type: '%label% must be a boolean',
  },
  sameAs: '%label% must be the same as %keyValue%',
}

export function defaultMessage(msg = {}) {
  for (let key in msg) {
    if (!(key in initialMsg)) continue
    initialMsg[key] = { ...initialMsg[key], ...msg[key] }
  }
}
export function defaultMsg(
  msg = '%label is invalid',
  { label = 'This', value = '', keyValue = '' },
) {
  return msg
    .replace('%value%', value)
    .replace('%label%', label)
    .replace('%keyValue%', keyValue)
}
