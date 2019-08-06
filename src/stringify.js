import {isArray, isPlainObject} from './helpers';

const normalizeOptions = opts => ({
  delimiter: opts.delimiter || '&',
  encoder: opts.encoder || encodeURIComponent,
});

const stringify = (key, value, options) => {
  if (isArray(value)) {
    return value
      .map(child => stringify(`${key}[]`, child, options))
      .join(options.delimiter);
  }

  if (isPlainObject(value)) {
    const parts = [];
    for (const childKey in value) {
      parts.push(stringify(`${key}[${childKey}]`, value[childKey], options));
    }

    return parts.join(options.delimiter);
  }

  return `${key}=${options.encoder(value.toString())}`;
};

export default (obj, opts = {}) => {
  const options = normalizeOptions(opts);
  const parts = [];

  for (const key in obj) {
    parts.push(stringify(key, obj[key], options));
  }
  return parts.join(options.delimiter);
};
