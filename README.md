# rackstring

A drop-in replacement for Node's `querystring` module that parses query strings [as Rack does](https://github.com/rack/rack/blob/master/lib/rack/query_parser.rb), with support for nested objects and nested arrays.

## Why?

There are a couple of popular alternatives to Node's `querystring` module, namely [`qs`](https://github.com/ljharb/qs) and [`query-string`](https://github.com/sindresorhus/query-string). Unfortunately:
- `query-string` chooses not to support nested objects (objects in arrays).
- `qs` does not parse objects nested in arrays quite yet; see https://github.com/ljharb/qs/issues/215.

At [Code Climate](https://codeclimate.com), we use Rack (vis-a-vis Rails) to handle web requests. Many of our client-to-server transactions rely on conforming query string formats, and neither alternative module supports parsing complex query strings in a Rack-compliant way. I explored forking `qs` and adding an option to support this sort of parsing, but adding this support proved to be non-trivial. Hence, `rackstring` was born.

## Installation

```sh
npm install rackstring ---save
```

## Usage

### Parsing query strings

```js
const querystring = require("rackstring")

const obj = querystring.parse("foo=bar")
assert.deepEqual(obj, { foo: "bar" })
```

As promised, `rackstring` supports parsing bracket-formatted arrays:

```js
const obj = querystring.parse("foo[]=bar&foo[]=baz")
assert.deepEqual(obj, { foo: ["bar", "baz"] })
```

Additionally, `rackstring` parses complex arrays:

```js
const obj = querystring.parse("foo[][a]=bar&foo[][b]=baz&foo[a]=meow&foo[b]=ruff")
assert.deepEqual(obj, { foo: [{ a: "bar", b: "baz"}, {a: "meow", b: "ruff"}] })
```

## License

See [LICENSE.md](LICENSE.md).
