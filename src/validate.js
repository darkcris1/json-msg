/* eslint-disable no-case-declarations */
import {
  isArray,
  isBoolean,
  isEmpthyObj,
  isFunction,
  isObj,
  isString,
  isNumber,
  isRegExp,
  isUndefined,
} from './is'
import { defaultMsg } from './messages'

// Utils
const getPath = (path, obj) =>
  path.split('.').reduce((acc, val) => acc[val], obj)
/**
 * This will return a message if the certain condition not met
 * @param {string} key
 * @param {any} value
 * @param {object} typeObj
 * @param {string} label
 * @param {string} msg
 */
function _checkMinMax(key, value, typeObj, msg) {
  const isMin = key === 'min'
  const minMax = typeObj[key]
  switch (typeObj.type) {
    case 'string':
    case 'array':
      if (isMin && value.length < minMax) return msg
      else if (!isMin && value.length > minMax) return msg
      break
    case 'number':
      if (isMin && value < minMax) return msg
      else if (!isMin && value > minMax) return msg
  }
}

/**
 * This will return true if the value is some of the items
 * @param {array} array
 * @param {string} value
 */

function _isAllowed(array, value) {
  for (var i = 0; i < array.length; i++) if (array[i] === value) return true
}

function _checkOptionKey(config) {
  const { label, typeObj, value, data, showAllErrors, message, allow } = config

  if (allow && _isAllowed(allow, value)) return

  const errors = []

  for (let key in typeObj) {
    const keyValue = typeObj[key]

    let msg = defaultMsg(message[key], { label, value, keyValue }) // generate a default message for erorrs

    switch (key) {
      case 'sameAs': // check if its the same with the given paths
        if (!(getPath(keyValue, data) === value)) errors.push(msg)
        break
      case 'min': // check the value if it is
      case 'max':
        if (isUndefined(value)) continue
        const errorMsg = _checkMinMax(key, value, typeObj, msg)
        if (errorMsg) errors.push(errorMsg)
        break
      case 'required': // check the value if it s undefined
        const isValueEmpty =
          isUndefined(value) || (typeObj.type === 'string' && value === '')
        if (!keyValue && isValueEmpty) return null
        if (keyValue && isValueEmpty) errors.push(msg)
        break
      case 'digit': // chech the value if its certain to its minimum digits
        if (!RegExp('d{' + keyValue + '}').test(value)) errors.push(msg)
        break
      case 'type': // check the type of the value
        if (!_checkType(value, typeObj.type)) errors.push(msg)
        break
      default:
        // Custom Types checking
        if (isRegExp(keyValue) && !keyValue.test(value)) errors.push(msg)
        else if (isFunction(keyValue) && !keyValue(value)) errors.push(msg)
    }
    // Return immediately if the showAllErrors is falsy
    if (!showAllErrors && !(errors.length === 0)) return errors[0]
  }
  return errors.length === 0 ? null : errors
}

/**
 * Return true if the the type of the value is not match
 * @param {string} value
 * @param {string} type
 */
function _checkType(value, type) {
  type = type.toLowerCase()
  switch (type) {
    case 'string':
      return isString(value)
    case 'array':
      return isArray(value)
    case 'boolean':
      return isBoolean(value)
    case 'number':
      return isNumber(value)
  }
  return true
}

/**
 * Check the data if there is a key that is not belong to schema
 * @param {any} data
 * @param {object} schema
 * @param {object} error
 * @param {object} abortEarly
 */
function _checkNotPartOfSchema(data, schema, error = {}, abortEarly) {
  for (let key in data) {
    if (isObj(schema[key]) && isObj(data[key])) {
      const errorMsg = _checkNotPartOfSchema(data[key], schema[key], error[key])
      if (!isEmpthyObj(errorMsg)) error[key] = errorMsg
      continue
    }
    if (key in schema) continue
    error[key] = key + ' is not part of schema'
    if (abortEarly) return error
  }
  return error
}

// Process all the validating errors here
function checkDataErrors(data, schema, error = {}, config) {
  const abortEarly = isUndefined(config.abortEarly) ? true : config.abortEarly
  for (let key in schema) {
    const value = data[key]
    const typeObj = schema[key]
    const label = typeObj.label || key

    if (isObj(typeObj)) {
      if (isObj(value)) {
        const errorMsg = checkDataErrors(value, typeObj, error[key], config)
        if (errorMsg) {
          error[key] = errorMsg
          if (abortEarly) return error
        }
        continue
      }
      error[key] = label + ' must be an object'
      continue
    }

    const errorMsg = validateSingle({
      showAllErrors: config.showAllErrors,
      data,
      value,
      typeObj,
      label,
    })
    if (errorMsg) {
      error[key] = errorMsg
      if (abortEarly) return error
    }
  }
  _checkNotPartOfSchema(data, schema, error, abortEarly)
  return isEmpthyObj(error) ? null : error
}

// Validate only a primitive value
function validateSingle({ typeObj, ...rest }) {
  return _checkOptionKey({
    label: typeObj.label || 'This',
    typeObj: typeObj.config,
    allow: typeObj.allow,
    message: typeObj.message,
    ...rest,
  })
}

function validate(data, schema, config = {}) {
  if (isObj(data)) return checkDataErrors(data, schema, {}, config)

  return validateSingle({
    value: data,
    typeObj: schema,
    showAllErrors: config.showAllErrors,
  })
}

// return a promise
function validateAsync(data, schema, config) {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    const errors = validate(data, schema, config)
    if (errors) reject(errors)
    resolve(null)
  })
}

export { validate, validateAsync }
