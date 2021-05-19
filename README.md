# json-msg

json-msg is a lightweight alternative for Joi or Yup or any json validator.
Unlike Joi, json-msg only focus on error messages and validations

Checkout Documentation: **[json-msg documentation](https://json-msg.vercel.app/)**

## Features

- Customizable Messages
- Custom Validation
- Very Simple
- Exntendable Custom Validators
- Lightweight 7kb
- Fast (No serialization of data)
- No Dependencies

## Installation

Npm

```bash
npm i json-msg
```

Unpkg - 10kb

```html
<script src="https://unpkg.com/json-msg"></script>
```

UNPKG Unbabel version - 7kb (IE not supported)

```html
<script src="https://unpkg.com/json-msg/dist/jm.unbabel.min.js"></script>
```

## Usage

```javascript
import jm "json-msg";

const schema = {
  username: jm.str(),
  password: jm.num()
  confirmPassword: jm.sameAs("password")
}

const data = {
  username: "cris123",
  password: 123456,
  confirmPassword: 123456,
}
jm.validate(data,schema)
```

## Complex Validation

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
