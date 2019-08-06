import parse from "./../src/parse"

test("parses basic query params", () => {
  expect(parse("foo=bar")).toEqual({ foo: "bar" })
})

test("parses arrays", () => {
  expect(parse("a[]=b&a[]=c")).toEqual({ a: ["b", "c"] })
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

test("throws on type mismatch", () => {
  expect(() => parse("a=b&a[]=c")).toThrow(
    "Expected array (got String) for param a"
  )
})
