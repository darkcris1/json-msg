import jm from '../dist/jm.cjs'
import { TYPE_KEY, isFunction, isRegExp } from '../src/is'

function getInitialOptions(type) {
  if (type === 'sameAs')
    return {
      [TYPE_KEY]: true,
      config: {
        sameAs: '',
      },
    }

  return {
    [TYPE_KEY]: true,
    message: {},
    config: {
      ...(type ? { type } : ''),
      required: true,
    },
  }
}

describe('json-msg types', () => {
  it('check all the initial options', () => {
    expect(jm.str({ min: 4 })).toMatchObject(getInitialOptions('string'))
    expect(jm.array()).toMatchObject(getInitialOptions('array'))
    expect(jm.num()).toMatchObject(getInitialOptions('number'))
    expect(jm.sameAs()).toMatchObject(getInitialOptions('sameAs'))
    expect(jm.bool()).toMatchObject(getInitialOptions('boolean'))
    expect(jm.any()).toMatchObject(getInitialOptions())
  })
  it('jm.str()', () => {
    const min = 5
    const max = 5
    const label = 'user'
    const test = jm.str({ min, max, label, email: true, alphanum: true })
    expect(test).toMatchObject({
      config: { min, max },
      label,
    })
    expect(isFunction(test.config.email)).toBe(true)
    expect(isRegExp(test.config.alphanum)).toBe(true)
  })
  it('jm.num()', () => {
    const min = 5
    const max = 5
    const label = 'Pin'
    const test = jm.num({ min, max, label, integer: true, float: true })
    expect(test).toMatchObject({
      config: { min, max },
      label,
    })
    expect(isFunction(test.config.integer)).toBe(true)
    expect(isFunction(test.config.float)).toBe(true)
  })
  it('jm.array()', () => {
    const min = 5
    const max = 5
    const label = 'Items'
    const test = jm.array({ min, max, label, items: jm.num() })
    expect(test).toMatchObject({
      config: { min, max },
      label,
    })
    expect(isFunction(test.config.items)).toBe(true)
  })
  it('jm.bool()', () => {
    const label = 'isGold'
    const required = false
    const test = jm.array({ required, label })
    expect(test).toMatchObject({
      config: { required },
      label,
    })
  })
  it('jm.sameAs()', () => {
    const label = 'confirm'
    const test = jm.sameAs('pass', { label })
    expect(test).toMatchObject({
      config: { sameAs: 'pass' },
      label,
    })
  })
  it('jm.any()', () => {
    const label = 'confirm'
    const test = jm.any({ label })
    expect(test).toMatchObject({
      label,
    })
  })
})
