import jm from "../src/index";
import { isJmArrayMsg } from "../src/is";

const testSchema = {
  user: jm.str({ min: 5, max: 50, alphanum: true }),
  pass: jm.str({ min: 4 }),
  confirm_pass: jm.sameAs("pass"),
  tags: jm.array({ min: 1, items: jm.str() }),
  pin: jm.num({ digit: 4, integer: true, label: "PIN" }),
  email: jm.str({ email: true }),
  isGold: jm.bool({ allow: [null] }),
  isAdmin: jm.bool(),
};
const testData = {
  user: "user123",
  pass: "12345",
  confirm_pass: "12345",
  tags: ["asdasd", "asdasd"],
  pin: 1234,
  email: "sircnujnuj@gmail.com",
  isGold: null,
  isAdmin: true,
};
const arraySchema = jm.array({ items: [{ name: jm.str({ min: 5 }) }] });
const arrayData = [{ name: 2 }];

describe("Check the validation function", () => {
  it("jm.validate() with no errors", () => {
    const test = jm.validate(testData, testSchema);
    expect(test).toBeNull();
  });
  it("jm.validate() with abortEarly: false", () => {
    const cloneData = { ...testData };
    cloneData.user = "as";
    cloneData.pin = 123;
    const test = jm.validate(cloneData, testSchema, { abortEarly: false });
    expect(test).toEqual({
      user: "user must atleast 5 characters",
      pin: "PIN must be 4 digit number",
    });
  });
  it("jm.validate() with showAllErrors: true and abortEarly: false", () => {
    const cloneData = { ...testData };
    cloneData.user = "as";
    cloneData.tags = "";
    cloneData.pin = 123;

    const test = jm.validate(cloneData, testSchema, {
      abortEarly: false,
      showAllErrors: true,
    });
    expect(isJmArrayMsg(test.tags)).toBe(true);
    expect(test).toMatchObject({
      user: ["user must atleast 5 characters"],
      tags: {},
      pin: ["PIN must be 4 digit number"],
    });
  });

  it("jm.validate({ strict: false }) ", () => {
    testData.asd213 = 123;
    const test = jm.validate(testData, testSchema, { strict: true });
    expect(test).toMatchObject({ asd213: "asd213 is not part of schema" });
  });
  it("jm.validate() single validation", () => {
    // Any
    expect(jm.validate("asd", jm.any())).toBe(null);
    expect(jm.validate(123, jm.any())).toBe(null);
    expect(jm.validate([], jm.any())).toBe(null);
    expect(jm.validate("", jm.any())).toBe(null);
    expect(jm.validate(undefined, jm.any())).toBe(null);

    //Array
    expect(isJmArrayMsg(jm.validate(123, jm.array()))).toBeTruthy();
    expect(jm.validate(arrayData, arraySchema)).toMatchObject({ 0: {} });

    // String
    expect(jm.validate("asd", jm.str())).toBeNull();
    expect(jm.validate("", jm.str({ required: false }))).toBeNull();
    expect(jm.validate(undefined, jm.str({ required: false }))).toBeNull();
    expect(
      jm.validate("darkcris2341@gmail.com", jm.str({ email: true }))
    ).toBeNull();
    expect(jm.validate(["asd"], jm.array({ items: jm.str() }))).toBeNull();

    // Number
    expect(jm.validate(12.023, jm.num({ float: true }))).toBeNull();
    expect(!!jm.validate(12, jm.num({ float: true }))).toBeTruthy();
    expect(jm.validate(123, jm.num())).toBeNull();
    expect(jm.validate(123, jm.num({ integer: true }))).toBeNull();
    expect(!!jm.validate(123.23, jm.num({ integer: true }))).toBeTruthy();

    // Object
    expect(jm.validate({}, jm.obj({}))).toBeNull();
    expect(jm.validate({ name: "" }, jm.obj({ name: jm.str() }))).toMatchObject(
      { name: "name is required" }
    );
    expect(
      jm.validate(undefined, jm.obj({ name: jm.str() }, { required: true }))
    ).toBe("This is required");

    // Boolean
    expect(jm.validate(true, jm.bool())).toBeNull();
    expect(() => jm.validate("asdasd", jm.sameAs("password"))).toThrow();
  });
});
