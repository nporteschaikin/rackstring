import { isArray, isPlainObject, objectHas } from "./helpers"

const normalizeOptions = (opts) => ({
  delimiter: opts.delimiter || "&",
  decoder: opts.decoder || decodeURIComponent,
  depth: opts.depth || 5,
  parseBooleans: !!opts.parseBooleans,
})

const assertArray = (key, obj) => {
  if (!isArray(obj)) {
    throw new Error(
      `Expected array (got ${obj.constructor.name}) for param ${key}`
    )
  }
}

const assertPlainObject = (key, obj) => {
  if (!isPlainObject(obj)) {
    throw new Error(
      `Expected object (got ${obj.constructor.name}) for param ${key}`
    )
  }
}

const parseRawValue = (value, options) => {
  if (
    options.parseBooleans &&
    value !== null &&
    ["true", "false"].includes(value.toString().toLowerCase())
  ) {
    return value.toLowerCase() === "true"
  }

  if (typeof value === "undefined") {
    return null
  }

  return value
}

const normalizeParams = (params, key, value, depth, options) => {
  if (depth <= 0) {
    throw new RangeError("Exceeded maximum depth")
  }

  const keyMatch = key.match(/^[\[\]]*([^\[\]]+)\]*/) || []
  const k = keyMatch[1] || ""
  const after = key.substr((keyMatch[0] || "").length)

  if (k.length === 0) {
    if (value !== null && key == "[]") {
      return isArray(value) ? value : [value]
    } else {
      return
    }
  }

  if (after === "") {
    params[k] = parseRawValue(value, options)
  } else if (after == "[]") {
    params[k] = params[k] || []
    assertArray(k, params[k])
    if (typeof value !== "undefined")
      params[k].push(parseRawValue(value, options))
  } else {
    const afterMatch =
      after.match(/^\[\]\[([^\[\]]+)\]$/) || after.match(/^\[\](.+)$/)

    if (afterMatch) {
      params[k] = params[k] || []
      assertArray(k, params[k])
      const last = params[k][params[k].length - 1]

      if (isPlainObject(last) && !objectHas(last, afterMatch[1])) {
        normalizeParams(last, afterMatch[1], value, depth - 1, options)
      } else {
        params[k].push(
          normalizeParams({}, afterMatch[1], value, depth - 1, options)
        )
      }
    } else {
      params[k] = params[k] || {}
      assertPlainObject(k, params[k])
      normalizeParams(params[k], after, value, depth - 1, options)
    }
  }

  return params
}

export default (str, opts = {}) => {
  const params = {}
  const options = normalizeOptions(opts)
  const qs = str || ""

  qs.split(options.delimiter).forEach((part) => {
    const [key, value] = part.split("=").map((p) => options.decoder(p))
    normalizeParams(params, key, value, options.depth, options)
  })

  return params
}
