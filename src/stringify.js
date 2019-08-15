import { isArray, isPlainObject } from "./helpers"

const normalizeOptions = (opts) => ({
  delimiter: opts.delimiter || "&",
  encoder: opts.encoder || encodeURIComponent,
  encodeKeys: !!opts.encodeKeys,
})

const stringify = (key, value, options) => {
  if (isArray(value)) {
    const arrKey = `${key}[]`

    if (value.length === 0) return stringify(arrKey, null, options)

    return value
      .map((child) => stringify(arrKey, child, options))
      .join(options.delimiter)
  }

  if (isPlainObject(value)) {
    const parts = []
    for (const childKey in value) {
      parts.push(stringify(`${key}[${childKey}]`, value[childKey], options))
    }

    return parts.join(options.delimiter)
  }

  if ("undefined" === typeof value) return ""

  const parts = [options.encodeKeys ? options.encoder(key) : key]
  if (value !== null) parts.push(options.encoder(value))

  return parts.join("=")
}

export default (obj, opts = {}) => {
  const options = normalizeOptions(opts)
  const parts = []

  for (const key in obj) {
    parts.push(stringify(key, obj[key], options))
  }

  return parts.filter((p) => p.length > 0).join(options.delimiter)
}
