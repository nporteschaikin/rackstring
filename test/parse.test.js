import { parse } from "./../src"

test("parses basic query params", () => {
  expect(parse("foo=bar")).toEqual({ foo: "bar" })
})

test("parses arrays", () => {
  expect(parse("a[]=b&a[]=c")).toEqual({ a: ["b", "c"] })
})

test("parses empty arrays", () => {
  expect(parse("a[]=b&b[]")).toEqual({ a: ["b"], b: [] })
})

test("parses objects", () => {
  expect(parse("a[b]=c&a[d]=e")).toEqual({
    a: { b: "c", d: "e" },
  })
})

test("parses array of objects", () => {
  expect(parse("a[][x]=b&a[][y]=c&a[][x]=d&a[][y]=e")).toEqual({
    a: [{ x: "b", y: "c" }, { x: "d", y: "e" }],
  })
})

test("parses array of objects with arrays", () => {
  expect(
    parse("a[][x]=b&a[][y]=c&a[][z][]=foo&a[][x]=d&a[][y]=e&a[][z][]=bar")
  ).toEqual({
    a: [{ x: "b", y: "c", z: ["foo"] }, { x: "d", y: "e", z: ["bar"] }],
  })
})

test("parses array of objects with objects", () => {
  expect(
    parse("a[][x]=b&a[][y]=c&a[][z][foo]=foo&a[][x]=d&a[][y]=e&a[][z][foo]=bar")
  ).toEqual({
    a: [
      { x: "b", y: "c", z: { foo: "foo" } },
      { x: "d", y: "e", z: { foo: "bar" } },
    ],
  })
})

test("ignores leading ? on string when configured", () => {
  expect(parse("?foo=bar", { ignoreQueryPrefix: true })).toEqual({ foo: "bar" })
})

test("keeps leading ? by default", () => {
  expect(parse("?foo=bar")).toEqual({ "?foo": "bar" })
})

test("supports depth option", () => {
  expect(parse("a[][x]=b&a[][y]=c&a[][x]=d&a[][y]=e")).toEqual({
    a: [{ x: "b", y: "c" }, { x: "d", y: "e" }],
  })
})

test("parses booleans if `parseBooleans` is true", () => {
  expect(parse("a[]=true&a[]=false&b=false", { parseBooleans: true })).toEqual({
    a: [true, false],
    b: false,
  })
})

test("handles null", () => {
  expect(parse("a=b&b")).toEqual({
    a: "b",
    b: null,
  })
})

test("throws on type mismatch", () => {
  expect(() => parse("a=b&a[]=c")).toThrow(
    "Expected array (got String) for param a"
  )
})
