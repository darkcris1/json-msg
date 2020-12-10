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
  'T.$$.KE.y': true
  config: object
}

interface MainSchema {
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
  [key: string]: RegExp | ((value: any) => boolean)
}

interface StringSchema extends MainSchema {
  email?: boolean
  alphanum?: boolean
}

interface NumberSchema extends MainSchema {
  digit?: number
  float?: boolean
  integer?: boolean
}

interface ArraySchema extends MainSchema {
  items?: Config | Config[]
}

interface BooleanSchema {
  required?: boolean
  message?: MessageObject
  label?: string
}

interface SameAsSChema {
  message?: MessageObject
  label?: string
}
interface anySchema {
  label?: string
  required?: boolean
  message?: MessageObject
}
type TypeObject =
  | StringSchema
  | NumberSchema
  | StringSchema
  | SameAsSChema
  | BooleanSchema

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

interface DefaultMessageObject {
  string?: MessageObject
  boolean?: MessageObject
  number?: MessageObject
  sameAs?: string
  array?: MessageObject
}

declare namespace jm {
  function str(config: StringSchema): Config

  function num(config: NumberSchema): Config

  function array(config: ArraySchema): Config

  function bool(config: BooleanSchema): Config

  function any(config: anySchema): Config

  function sameAs(path: string, config: SameAsSChema): Config
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
  function validateAsync(
    data: any,
    schema: TypeObject | object,
    option: ValidationOption,
  ): Promise<null | object>

  function validate(
    data: any,
    schema: TypeObject | object,
    option: ValidationOption,
  ): null | object
}

const jm: jm

export default jm
