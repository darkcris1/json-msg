import jm from '../dist/jm.cjs'

const testSchema = {
  user: jm.str({ min: 5, max: 50, alphanum: true }),
  pass: jm.str({ min: 4 }),
  confirm_pass: jm.sameAs('pass'),
  tags: jm.array({ min: 1, items: jm.str() }),
  pin: jm.num({ digit: 4, integer: true, label: 'PIN' }),
  email: jm.str({ email: true }),
  isGold: jm.bool({ allow: [null] }),
  isAdmin: jm.bool(),
}
const testData = {
  user: 'user123',
  pass: '12345',
  confirm_pass: '12345',
  tags: ['asdasd', 'asdasd'],
  pin: 1234,
  email: 'sircnujnuj@gmail.com',
  isGold: null,
  isAdmin: true,
}

describe('Check the validation function', () => {
  it('jm.validate() with no errors', () => {
    const test = jm.validate(testData, testSchema)
    expect(test).toBeNull()
  })
  it('jm.validate() with abortEarly: false', () => {
    const cloneData = { ...testData }
    cloneData.user = 'as'
    cloneData.tags = []
    cloneData.pin = 123

    const test = jm.validate(cloneData, testSchema, { abortEarly: false })
    expect(test).toEqual({
      user: 'user characters length must be greater than 5',
      tags: 'tags must contain atleast 1 items',
      pin: 'PIN must be 4 digit number',
    })
  })
  it('jm.validate() with showAllErrors: true and abortEarly: false', () => {
    const cloneData = { ...testData }
    cloneData.user = 'as'
    cloneData.tags = ''
    cloneData.pin = 123

    const test = jm.validate(cloneData, testSchema, {
      abortEarly: false,
      showAllErrors: true,
    })
    expect(test).toEqual({
      user: ['user characters length must be greater than 5'],
      tags: [
        'tags must be an array',
        'tags must contain atleast 1 items',
        'All items must be match of the type',
      ],
      pin: ['PIN must be 4 digit number'],
    })
  })
  it('jm.validate() single validation', () => {
    expect(jm.validate('asd', jm.str())).toBeNull()
    expect(jm.validate('', jm.str({ required: false }))).toBeNull()
    expect(jm.validate(undefined, jm.str({ required: false }))).toBeNull()
    expect(
      jm.validate('sircnujnuj@gmail.com', jm.str({ email: true })),
    ).toBeNull()

    expect(jm.validate(123, jm.num())).toBeNull()

    expect(jm.validate(123, jm.num({ integer: true }))).toBeNull()

    expect(jm.validate(12.023, jm.num({ float: true }))).toBeNull()
    expect(jm.validate(['asd'], jm.array({ items: jm.str() }))).toBeNull()
    expect(jm.validate(true, jm.bool())).toBeNull()
    expect(() => jm.validate('asdasd', jm.sameAs('password'))).toThrow()
  })
})
