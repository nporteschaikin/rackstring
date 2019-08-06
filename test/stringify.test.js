import { stringify } from "./../src"

test("stringifies simple object", () => {
  expect(stringify({ foo: "bar" })).toEqual("foo=bar")
})

test("stringifies arrays", () => {
  expect(stringify({ foo: ["bar", "baz"] })).toEqual("foo[]=bar&foo[]=baz")
})

test("stringifies objects", () => {
  expect(stringify({ foo: { bar: "a", baz: "b" } })).toEqual(
    "foo[bar]=a&foo[baz]=b"
  )
})

test("stringifies array of objects", () => {
  expect(
    stringify({ foo: [{ bar: "a", baz: "b" }, { bar: "c", baz: "d" }] })
  ).toEqual("foo[][bar]=a&foo[][baz]=b&foo[][bar]=c&foo[][baz]=d")
})

test("stringifies nested array of objects", () => {
  expect(
    stringify({ foo: [{ bar: ["a", "b"] }, { bar: ["a", "b"] }] })
  ).toEqual("foo[][bar][]=a&foo[][bar][]=b&foo[][bar][]=a&foo[][bar][]=b")
})

test("encodes keys if encodeKeys = true", () => {
  expect(
    stringify({ "foo/x": { "meow d": "bar" } }, { encodeKeys: true })
  ).toEqual("foo%2Fx%5Bmeow%20d%5D=bar")
})

test("handles undefined values", () => {
  expect(stringify({ foo: undefined, bar: "baz" })).toEqual("foo=&bar=baz")
})

test("handles null values", () => {
  expect(stringify({ foo: null, bar: "baz" })).toEqual("foo=&bar=baz")
  expect(stringify({ foo: { a: null, bar: "baz" } })).toEqual(
    "foo[a]=&foo[bar]=baz"
  )
})

test("handles empty arrays", () => {
  expect(stringify({ foo: [], bar: "baz" })).toEqual("bar=baz")
})
