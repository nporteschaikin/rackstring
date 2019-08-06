export const isPlainObject = (obj) =>
  typeof obj === "object" && obj.constructor === Object

export const isArray = (obj) => Array.isArray(obj)
export const objectHas = (obj, key) => obj.hasOwnProperty(key)
