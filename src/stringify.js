import { isArray, isPlainObject } from "./helpers"

const normalizeOptions = (opts) => ({
  delimiter: opts.delimiter || "&",
  encoder: opts.encoder || encodeURIComponent,
  encodeKeys: !!opts.encodeKeys,
})

const formatValue = (value, encoder) => {
  if (value === null || typeof value === "undefined") {
    return encoder("")
  }

  return encoder(value)
}

const stringify = (key, value, options) => {
  if (isArray(value)) {
    return value
      .map((child) => stringify(`${key}[]`, child, options))
      .join(options.delimiter)
  }

  if (isPlainObject(value)) {
    const parts = []
    for (const childKey in value) {
      parts.push(stringify(`${key}[${childKey}]`, value[childKey], options))
    }

    return parts.join(options.delimiter)
  }

  const keyEncoder = options.encodeKeys ? options.encoder : (str) => str
  return `${keyEncoder(key)}=${formatValue(value, options.encoder)}`
}

export default (obj, opts = {}) => {
  const options = normalizeOptions(opts)
  const parts = []

  for (const key in obj) {
    parts.push(stringify(key, obj[key], options))
  }

  return parts.filter((p) => p.length > 0).join(options.delimiter)
}
