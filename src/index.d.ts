/**
 *  Messages for errors
 */
interface MessageObject {
  type?: string
  required?: string
  max?: string
  min?: string
  alphanum?: string
  items?: string
  sameAs?: string
  integer?: string
  email?: string
  [key: string]: string
}

interface Config {
  message: MessageObject
  allow?: any[]
  isJsonMsg: true
  config: object
}

interface MainSchema {
  /**
   * ReadOnly Property
   */
  readonly type?: String
  message?: MessageObject
  /**
   * check the min length or min value of a data
   * @default undefined
   */
  min?: number
  /**
   * check the max length or max value of a data
   * @default undefined
   */
  max?: number
  /**
   * Set a default label for messages
   *
   * default value is the keys of your object
   */
  label?: string
  /**
   *  This will allow the validator that value is allowed
   * @default undefined
   */
  allow?: any[]
  /**
   * When its false validator will ignore whether its undefined or empty string
   * @default true
   */
  required?: boolean

  /**
   * Add A custom validation
   */
  [key: string]: any
}

export interface StringSchema extends MainSchema {
  email?: boolean
  alphanum?: boolean
}

export interface NumberSchema extends MainSchema {
  /**
   * Check if the number how many digits in the number
   * @default undefined
   */
  digit?: number
  /**
   * Check if the number is integer
   * @default false
   */
  float?: boolean
  /**
   * Check if the number is integer
   * @default false
   */
  integer?: boolean
}

export interface ArraySchema extends MainSchema {
  /**
   * You can add either array or type object directly
   * array({items: num()}) // this will check if the items of the array is a number
   *
   * or
   *
   * array({items: [num(), str()] , min: 2})
   */
  items?: Config | Config[]
}

export interface BooleanSchema {
  required?: boolean
  message?: MessageObject
  label?: string
}

export interface SameAsSChema {
  message?: MessageObject
  label?: string
}
export interface anySchema {
  label?: string
  required?: boolean
  message?: MessageObject
}
export type JMTypeObject =
  | StringSchema
  | NumberSchema
  | StringSchema
  | BooleanSchema
  | ArraySchema
  | anySchema
  | object

interface ValidationOption {
  /**
   * When its true this will return an array of all the errors of that key value
   * @default false
   */
  showAllErrors?: boolean
  /**
   * if its false, this will return all the errors
   * if its true, validator will immediately return if there is an error
   * @default true
   */
  abortEarly?: boolean
}

export interface DefaultMessageObject {
  string?: MessageObject
  boolean?: MessageObject
  number?: MessageObject
  sameAs?: string
  array?: MessageObject
}

declare namespace jm {
  function str(config?: StringSchema): Config

  function num(config?: NumberSchema): Config

  function array(config?: ArraySchema): Config

  function bool(config?: BooleanSchema): Config

  function any(config?: anySchema): Config
  /**
   * path for the same input
   * eg.
   * {
   *  pass: str(),
   *  confirm_pass: sameAs("pass")
   * }
   * NOTE: This is only work for relative path
   */
  function sameAs(path: string, config?: SameAsSChema): Config
  /**
   * %label% is the label of the data -
   * %keyValue% is the value of the key -
   * %value% the value of the data -
   *
   * example: "%label% must have atleast %keyValue% length"
   * this will return "Username must have atleast 4 length"
   *
   */
  function defaultMessage(defaultMessage: DefaultMessageObject)
  /**
   * This will return an object of error messages
   *
   * if there is no errors this will rerturn null or undefined
   */

  /**
   * This will return a Promise of error messages or null if there is no errors
   */
  function validateAsync<data>(
    data: data,
    schema: JMTypeObject,
    option?: ValidationOption,
  ): Promise<null | data>

  /**
   * Return an object if error occured and return null if there is no errors
   */
  function validate<data>(
    data: data,
    schema: JMTypeObject,
    option?: ValidationOption,
  ): null | data
}

export default jm
