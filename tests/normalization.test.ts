import { expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import sharp from "sharp"
import { stackSvgsHorizontally, stackSvgsVertically } from "../lib"

const small =
  '<svg width="50" height="50"><circle cx="25" cy="25" r="20" fill="red" /></svg>'
const large =
  '<svg width="200" height="200"><circle cx="100" cy="100" r="80" fill="blue" /></svg>'

async function expectRenderedSvg(actual: string, name: string) {
  const expected = readFileSync(
    new URL(`./__snapshots__/normalization-${name}.snap.svg`, import.meta.url),
  )
  const renderedActual = await sharp(Buffer.from(actual))
    .raw()
    .toBuffer({ resolveWithObject: true })
  const renderedExpected = await sharp(expected)
    .raw()
    .toBuffer({ resolveWithObject: true })
  expect(renderedActual.info).toEqual(renderedExpected.info)
  expect(renderedActual.data.equals(renderedExpected.data)).toBe(true)
}

test("normalization scales drawing coordinates without a viewBox", async () => {
  await expectRenderedSvg(stackSvgsHorizontally([small, large]), "horizontal")
})

test("a custom target scales up and down without a viewBox", async () => {
  await expectRenderedSvg(
    stackSvgsVertically([small, large], { targetSize: 100 }),
    "vertical",
  )
})

test("disabling normalization preserves drawing and viewport sizes", async () => {
  await expectRenderedSvg(
    stackSvgsHorizontally([small, large], { normalizeSize: false }),
    "disabled",
  )
})

test("viewBox and plain SVGs receive the same normalized drawing size", async () => {
  const withViewBox =
    '<svg width="50" height="50" viewBox="-25 -25 50 50"><circle cx="0" cy="0" r="20" fill="red" /></svg>'
  await expectRenderedSvg(
    stackSvgsHorizontally([withViewBox, large], { targetSize: 100 }),
    "mixed",
  )
})
