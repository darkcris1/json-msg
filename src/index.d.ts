import { TYPE_KEY } from "./is";

/**
 *  Messages for errors
 */
interface MessageObject {
  type?: string;
  required?: string;
  max?: string;
  min?: string;
  alphanum?: string;
  items?: string;
  sameAs?: string;
  integer?: string;
  email?: string;
  maxSize?: string;
  minSize?: string;
  uppercase?: string;
  number?: string;
  [key: string]: string;
}

interface MainSchema {
  message?: MessageObject;

  /**
   * Set a default label for messages
   *
   * default value is the keys of your object
   */
  label?: string;
  /**
   *  This will allow the validator to allowed all the included values
   * @default undefined
   *
   * @example
   * {
   *    name: jm.str({ allow:[null, 0, 100] }) // This will allow the null,0 and 100
   * }
   */
  allow?: any[];

  /**
   * Add A custom validation
   */
  [key: string]: any;
}
interface Config<T> extends MainSchema {
  "$$jmType->": true;
  config: T;
}

type JMTypes =
  | "object"
  | "array"
  | "any"
  | "number"
  | "file"
  | "string"
  | "boolean";
export interface MainValidator {
  /**
   * Type is a ReadOnly Property
   */
  readonly type?: JMTypes;
  /**
   * When its false validator will ignore whether its undefined or empty string
   * @default true
   */
  required?: boolean;
}

export interface MinMaxValidator {
  /**
   * check the min length or min value of a data
   * @default undefined
   */
  min?: number;
  /**
   * check the max length or max value of a data
   * @default undefined
   */
  max?: number;
}
export interface StringValidator extends MainValidator, MinMaxValidator {
  email?: boolean;
  alphanum?: boolean;

  uppercase?: number;
  number?: number;
}

export interface NumberValidator extends MainValidator, MinMaxValidator {
  /**
   * Check if the number how many digits in the number
   * @default undefined
   */
  digit?: number;
  /**
   * Check if the number is integer
   * @default false
   */
  float?: boolean;
  /**
   * Check if the number is integer
   * @default false
   */
  integer?: boolean;
}

export interface ArrayValidator extends MainValidator, MinMaxValidator {
  /**
   * You can add either array or type object directly
   * array({items: num()}) // this will check if the items of the array is a number
   *
   * or
   *
   * array({items: [num(), str()] , min: 2})
   */
  items?: JMTypeObject | JMTypeObject[];
}

export interface BooleanValidator extends MainValidator {}
export interface SameasValidator extends MainValidator {}
export interface AnyValidator extends MainValidator {}
export interface ObjectValidator extends MainValidator {}
export interface FileValidator extends MainValidator {
  maxSize?: number;
  minSize?: number;
}

export interface StringSchema extends StringValidator, MainSchema {
  /**
   * This will trim the string value first before it validate
   *
   * NOTE: It will not serialize your data
   */
  trim?: boolean;
}
export interface AnySchema extends AnyValidator, MainSchema {}
export interface ArraySchema extends ArrayValidator, MainSchema {}
export interface ObjectSchema extends ObjectValidator, MainSchema {}
export interface FileSchema extends FileValidator, MainSchema {}
export interface SameasSchema extends SameasValidator, MainSchema {}
export interface BooleanSchema extends BooleanValidator, MainSchema {}
export interface NumberSchema extends NumberValidator, MainSchema {}

export type JMTypeObject = MainSchema | object;

interface ValidationOption {
  /**
   * When its true this will return an array of all the errors of that key value
   * @default false
   */
  showAllErrors?: boolean;
  /**
   * if its false, this will return all the errors
   * if its true, validator will immediately return if there is an error
   * @default true
   */
  abortEarly?: boolean;
  /**
   * If its false , it will not check the non properties part of schema
   * @default true
   */
  strict?: boolean;
}

export interface DefaultMessageObject {
  string?: MessageObject;
  boolean?: MessageObject;
  number?: MessageObject;
  sameAs?: string;
  array?: MessageObject;
  object: MessageObject;
  file: MessageObject;
}

interface ValidationParams<T> {
  value: any;
  data?: any;
  typeObj: Config<T>;
  key: string;
  keyValue: string;
}

interface useFnParams<T> {
  value: any;
  typeObj: Config<T>;
}
interface ValidatorsFn<T> {
  extend(params: { [key: string]: (param: ValidationParams<T>) => void }): void;
  use(...params: ((param: useFnParams<T>) => any)[]): any;
}

interface Validators {
  string: ValidatorsFn<StringValidator>;
  number: ValidatorsFn<NumberValidator>;
  array: ValidatorsFn<ArrayValidator>;
  object: ValidatorsFn<ObjectValidator>;
  any: ValidatorsFn<AnyValidator>;
  sameas: ValidatorsFn<SameasValidator>;
  file: ValidatorsFn<FileValidator>;
  boolean: ValidatorsFn<BooleanValidator>;
}

interface JsonMsg {
  str(config?: StringSchema): Config<StringValidator>;

  num(config?: NumberSchema): Config<NumberValidator>;

  array(config?: ArraySchema): Config<ArrayValidator>;

  bool(config?: BooleanSchema): Config<BooleanValidator>;

  any(config?: AnySchema): Config<AnyValidator>;

  file(config?: FileSchema): Config<FileValidator>;
  obj(
    shape: { [key: string]: Config<MainValidator> },
    config?: ObjectSchema
  ): Config<ObjectValidator>;
  /**
   * path for the same input
   * eg.
   * {
   *  pass: str(),
   *  confirm_pass: sameAs("pass")
   * }
   * NOTE: This is only work for relative path
   */
  sameAs(path: string, config?: SameasSchema): Config<SameasValidator>;
  /**
   * %label% is the label of the data -
   * %keyValue% is the value of the key -
   * %value% the value of the data -
   *
   * example: "%label% must have atleast %keyValue% length"
   * this will return "Username must have atleast 4 length"
   *
   */
  defaultMessage(defaultMessage: DefaultMessageObject): void;
  /**
   * This will return an object of error messages
   *
   * if there is no errors this will rerturn null or undefined
   */

  /**
   * This will return a Promise of error messages or null if there is no errors
   */
  validateAsync<data>(
    data: data,
    schema: JMTypeObject,
    option?: ValidationOption
  ): Promise<null | string | data>;

  /**
   * Return an object if error occured and return null if there is no errors
   */
  validate<data>(
    data: data,
    schema: JMTypeObject,
    option?: ValidationOption
  ): null | string | data;

  validators: Validators;
  [key: string]: any;
}

declare const jm: JsonMsg;

export default jm;
