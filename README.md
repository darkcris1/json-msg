# JSON Message

### JSON Message is a lightweight alternative for Joi or Yup or any json validator.

<br />

> ## Unlike Joi this is only **focus** on error messages

<br />
<hr />

## Features

- Customizable Messages
- Custom Validation
- Easy Configuration
- Lightweight 4.6kb
- Fast

## Docs

- [Installation](#Installation)
- [Types](#types)
- [Validation](#Validation)
- [Custom Validation](#Custom-Validation)
  - [RegExp Custom Validation](#Regexp-Custom-Validation)
  - [Function Custom Validation](#Regexp-Custom-Validation)
- [Custom Messages](#Custom-Messages)
- [Examples](#Examples)

# Installation

NPM

```bash
  npm i json-msg
```

UNPKG

```html
<script src="https://unpkg.com/json-msg"></script>
```

UNPKG Unbabel version - 4.6kb (IE not supported)

```html
<script src="https://unpkg.com/json-msg/dist/jm.unbabel.min.js"></script>
```

# Types

> ## All types are required by default

```javascript
import jm from 'json-msg'

jm.num() // Number
jm.str() // String
jm.bool() // boolean
jm.any() // any
joi.array() // array
jm.sameAs() // reference for the same input
// {} Object literal is objectType by default and its required. Thats why there is no object type

// Destructuring them

const { str, num, bool, any, array } = jm

const todoSchema = {
  title: str(),
  time: num(),
  complete: bool(),
  todos: array(),
  id: num({ min: 5, max: 10000 }),
}
```

> Note: sameAs() -> is relative path only

# Validation

```javascript
const todoData = {
  title: 'lorem ipsum',
  time: 1692565626,
  complete: false,
  todos: ['Shopping', 'Rading books'],
  id: 2,
}

// you can destructure the validate if you like

jm.validate(todoData, todoSchema)

/* return
    {
      id: "id must be greater than 2"
    }

    since the id is less than 5
*/

// asynchronous validation
jm.validateAsync(todoData, todoSchema)
// This will will return a promise

// You can also validate a single value
jm.validate("stts",num()))
//return "This must be a number"

```

# Custom Validation

## In custom validation you can validate them via RegExp or a Function that returns a boolean

<hr />

### RegExp Custom Validation

```javascript

// You can add custom validation many as you can

const hasNumberString = str({
   hasNumber: /[0-9]/,
})


jm.validate("cris",hasNumberString))
//return "This is invalid"

// this is the default message if you have not set a specific error messages

```

### Function Custom Validation

```javascript
// value is the data value
// in this case stts is the value
const hasUpperCase = (value) =>{
  return value.test(/[A-Z]/)
}

const upperCaseString = str({
   hasUpperCase: hasUpperCase,
})

jm.validate("stts",upperCaseString))

//return "This is invalid"


```

# Custom Messages

## There are two ways to set a message

## 1st way

```javascript
// set message directly into the type
const hasNumberString = str({
   hasNumber: /[0-9]/,
   min: 5,
   label: "Username",
   message: {
     //hasNumber key should be the same to the validator
     hasNumber: "%label% must have a number",

     // %keyValue% is the min: 5
     min: "%label% must atleast %keyValue% characters length",
   }
})
jm.validate("stts",hasNumberString))
// return "Username must have a number"

// if you validate a single value the label is "this" by default

// if the showAllErrors are true this will return an array of messages
jm.validate("stts",hasNumberString, {showAllErrors: true}))
/* return [
  "Username must have a number",
  "Username must atleast 5 characters length"
]
*/
```

## 2nd way

```javascript
// %label% is the label of your data
// %keyValue% is the value of the keys eg. 5000 is the keyValue of the min
// %value% is the data value that has pass in

jm.defaultMessage({
  string: {
    hasNumber: '%label% must have a number',
    /// You can set everything including min, max , type etc//.
    hasUpperCase:"%value% is invalid, it should have uppercase letter",
    min: "the %keyValue% is not the minimum length",
    type: '%label% must be a string text blablabla....',
  }
})


jm.defaultMessage({
  number: {
    //You can also set the number messages
  },
  boolean: {
    //You can also set the boolean messages
  },
  array: {
    //You can also set the arra messages
  },

  sameAs: string,// You can also set sameAs
})
```

# Examples

```javascript
import jm "json-msg";

const { str , bool, num, array , sameAs} = jm;

const userSchema = {
  id: num({min: 1000, max: 100000}),

  username: str({ min: 6,alphanum: true }),

  pass: str({ min: 6, label: "Password"  }),

  confirmPass: sameAs("pass",{label: "Confirm Password"}),

  age: num({min: 15}),

  gender: str({ required: false, allow: [null] }),

  hobbies: array({ items: str()})

  address: {
    city: str({ min: 1000 }),
    country: str({required: false})
  },
}

const userData = {
  id: 5000,
  username: "darkcris1",
  pass: "loremIpsum",
  age: 20,
  confirmPass: ""
  gender: null,
  hobbies: ["gaming", "coding", "solving"]
  address: {
    city: "Davao City",
  },
}


// if abortEarly is false, all the data properties errors will show

// if showALlErrors is true will give you an array of error messages on that specific errors

jm.validate(userData,userSchema,{abortEarly: false, showAllErrors: true})
```
