import { strict as assert } from "node:assert"
import { test } from "node:test"
import { stackSvgsHorizontally, stackSvgsVertically } from "../lib/index.ts"

const input = '<svg width="20" height="10"><rect width="20" height="10"/></svg>'

for (const [name, stack] of [
  ["horizontal", stackSvgsHorizontally],
  ["vertical", stackSvgsVertically],
] as const) {
  for (const [value, serialized] of [
    ['Board "A"', 'Board &quot;A&quot;'],
    ["A & B", "A &amp; B"],
    ["A < B", "A &lt; B"],
    ["A > B", "A > B"],
    ["&quot;", "&amp;quot;"],
    ["plain-value", "plain-value"],
  ]) {
    test(`${name} stack serializes root attribute ${JSON.stringify(value)} as XML text`, () => {
      const actual = stack([input], { rootAttributes: { "aria-label": value! } })
      assert.ok(actual.includes(`aria-label="${serialized}"`), actual)
      assert.ok(actual.includes('viewBox="0 0 20 10"'), actual)
    })
  }
}
