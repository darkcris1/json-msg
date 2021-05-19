import { TYPE_KEY } from "./is";
import { initialMsg } from "./messages";

const higherKey = ["required", "type"];

function initConfig(config) {
  const { required = true } = config;
  const leftOver = {};

  for (const key in config) {
    const keyValue = config[key];
    if (!higherKey.includes(keyValue) && keyValue !== false)
      leftOver[key] = keyValue;
  }
  return {
    required,
    type: config.type,
    ...leftOver,
  };
}

function Type(option = {}) {
  const { messages, label, allow, ...rest } = option;
  messages.required = messages.required || "%label% is required";
  const config = initConfig(rest); // Initialize the config into ideal option for validator

  return {
    config,
    messages,
    [TYPE_KEY]: true,
    label,
    allow,
  };
}

// Number type for validating errors
export function num(config = {}) {
  const type = "number";

  return Type({
    type,
    ...config,
    messages: { ...initialMsg[type], ...config.messages },
  });
}

// String type for validating errors
export function str(config = {}) {
  const type = "string";

  return Type({
    type,
    ...config,
    messages: { ...initialMsg[type], ...config.messages },
  });
}

// arrat type for validating errors
export function array(config = {}) {
  const type = "array";

  return Type({
    type,
    ...config,
    messages: {
      ...initialMsg[type],
      ...config.messages,
    },
  });
}

// Boolean type for checking errors
export function bool(config = {}) {
  const type = "boolean";
  return Type({
    type,
    ...config,
    messages: {
      ...initialMsg[type],
      ...config.messages,
    },
  });
}
export function file(config = {}) {
  const type = "file";
  return Type({
    type,
    ...config,
    messages: {
      ...initialMsg[type],
      ...config.messages,
    },
  });
}
export function obj(shape, config = {}) {
  const type = "object";
  return Type({
    type,
    required: false,
    ...config,
    shape,
    messages: {
      ...initialMsg[type],
      ...config.messages,
    },
  });
}
// reference for value
export function sameAs(key, config = {}) {
  return Type({
    sameAs: key || "",
    label: config.label,
    type: "sameas",
    messages: {
      sameAs: initialMsg.sameAs,
      ...config.messages,
    },
  });
}

export function any(config = {}) {
  return Type({ ...config, type: "any" });
}
