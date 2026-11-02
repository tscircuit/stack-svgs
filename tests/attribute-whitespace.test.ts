import { expect, test } from "bun:test"
import { stackSvgsHorizontally, stackSvgsVertically } from "../lib"

const content = '<rect width="20" height="10" fill="red"/>'
const compact = `<svg width="20" height="10" viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg">${content}</svg>`
const rootVariants = [
  '<svg width = "20" height = "10" viewBox = "0 0 20 10" xmlns = "http://www.w3.org/2000/svg">',
  "<svg width = '20' height = '10' viewBox = '0 0 20 10' xmlns = 'http://www.w3.org/2000/svg'>",
  '<svg width\t=\n"20" height\n=\t"10" viewBox\n=\n"0 0 20 10" xmlns\t=\t"http://www.w3.org/2000/svg">',
]

for (const [direction, stack] of [
  ["horizontal", stackSvgsHorizontally],
  ["vertical", stackSvgsVertically],
] as const) {
  for (const [index, root] of rootVariants.entries()) {
    test(`${direction} layout preserves valid root-attribute whitespace variant ${index}`, () => {
      const source = `${root}${content}</svg>`
      const options = { normalizeSize: false, gap: 3 }
      expect(stack([source, compact], options)).toBe(stack([compact, compact], options))
    })
  }

  test(`${direction} normalization treats spaced viewBox attributes identically`, () => {
    const source = '<svg viewBox = "-10 -5 20 10"><rect x="-10" y="-5" width="20" height="10"/></svg>'
    const reference = source.replace('viewBox = ', 'viewBox=')
    expect(stack([source], { targetSize: 40 })).toBe(stack([reference], { targetSize: 40 }))
  })
}
