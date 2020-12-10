import { isInt, isFloat, isEmail, isUndefined, TYPE_KEY, isArray } from './is'
import { initialMsg } from './messages'
import { validate } from './validate'

function removeUnuseOption(config, message) {
  const { label, allow, required } = config
  const typeObj = { message: {} }
  typeObj[TYPE_KEY] = true
  if (label) typeObj.label = label
  if (allow) typeObj.allow = allow
  if (!required) delete config.required

  for (let key in config)
    if (/message|label|allow/.test(key)) delete config[key]

  for (let key in config) typeObj.message[key] = message[key]

  typeObj.config = { ...config }
  return typeObj
}

function Type(option = {}) {
  const msg = option.message || {}
  msg.required = msg.required || '%label% is required'
  option.required = isUndefined(option.required) ? true : option.required

  const { message, config, ...rest } = removeUnuseOption(option, msg) // Initialize the config into ideal option for validator

  return {
    config,
    message,
    ...rest,
  }
}

// Number type for validating errors
export function num(config = {}) {
  const type = 'number'
  if (config.integer) config.integer = isInt
  if (config.float) config.float = isFloat
  return Type({
    ...config,
    type,
    message: { ...initialMsg[type], ...config.message },
  })
}

// String type for validating errors
export function str(config = {}) {
  const type = 'string'
  if (config.alphanum) config.alphanum = /^[A-Za-z0-9]+$/
  if (config.email) config.email = isEmail
  return Type({
    ...config,
    type,
    message: { ...initialMsg[type], ...config.message },
  })
}

// arrat type for validating errors
export function array(config = {}) {
  const type = 'array'
  const items = config.items
  const isItemsMatch = (arr) => {
    if (!arr) return
    const isItemArray = isArray(items)
    const theItem = isItemArray ? items : arr
    for (let i = 0; i < theItem.length; i++)
      if (validate(arr[i], isItemArray ? items[i] : items)) return false
    // if the {isItemArray}  item is array then loop dynamically through the items
    return true
  }

  if (items) config.items = isItemsMatch

  return Type({
    type,
    ...config,
    message: {
      ...initialMsg[type],
      ...config.message,
    },
  })
}

// Boolean type for checking errors
export function bool(config = {}) {
  const type = 'boolean'
  return Type({
    ...config,
    type,
    message: {
      ...initialMsg[type],
      ...config.message,
    },
  })
}
// reference for value
export function sameAs(key, config = {}) {
  return Type({
    sameAs: key || '',
    label: config.labael,
    message: {
      sameAs: initialMsg.sameAs,
      ...config.message,
    },
  })
}

export function any(config = {}) {
  return Type(config)
}
