export const TYPE_KEY = 'isJsonMsg' //Unique Type Obj Key

export const isFunction = (func) => func instanceof Function
export const isString = (str) => typeof str === 'string'
export const isArray = (arr) => Array.isArray(arr)
export const isRegExp = (regex) => regex instanceof RegExp
export const isBoolean = (bool) => typeof bool === 'boolean'
export const isNumber = (num) => !!(typeof num).match(/number|bigint/)
export const isUndefined = (obj) => typeof obj === 'undefined'
export const isFile = (file) => file instanceof File

export const isObj = (obj) =>
  !!obj && obj.constructor === Object && !obj[TYPE_KEY]
export const isInt = (num) => isNumber(num) && !(num % 1)
export const isFloat = (double) => isNumber(double) && !!(double % 1)
export const isEmail = (email) =>
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)
export const isEmpthyObj = (obj) => isObj(obj) && Object.keys(obj).length === 0
