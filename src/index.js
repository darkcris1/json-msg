import * as types from './types'
import { defaultMessage } from './messages'
import { validate, validateAsync } from './validate'

const jm = {
  ...types,
  defaultMessage,
  validate,
  validateAsync,
}

export default jm
