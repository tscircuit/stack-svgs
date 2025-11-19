import { expect, test, describe } from "bun:test";
import {
  stackSvgsHorizontally,
  stackSvgsVertically,
} from "../lib/index.ts";

const redCircle = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>`;

const blueSquare = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="80" height="80" fill="blue" />
</svg>`;

const greenTriangle = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,10 90,90 10,90" fill="green" />
</svg>`;

const tallRectangle = `<svg width="50" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="40" height="140" fill="purple" />
</svg>`;

const wideRectangle = `<svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="190" height="40" fill="orange" />
</svg>`;

const svgWithViewBox = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="50" fill="yellow" />
</svg>`;

const svgWithViewBoxAndDimensions = `<svg width="80" height="80" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
  <circle cx="80" cy="80" r="70" fill="cyan" />
</svg>`;

describe("stackSvgsHorizontally", () => {
  test("stacks two identical circles horizontally", async () => {
    const result = stackSvgsHorizontally([redCircle, redCircle]);
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("stacks two identical circles horizontally with gap", async () => {
    const result = stackSvgsHorizontally([redCircle, redCircle], { gap: 20 });
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("stacks three different shapes horizontally", async () => {
    const result = stackSvgsHorizontally([
      redCircle,
      blueSquare,
      greenTriangle,
    ]);
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("handles empty array", () => {
    const result = stackSvgsHorizontally([]);
    expect(result).toBe('<svg width="0" height="0" viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg"></svg>');
  });

  test("handles single SVG", async () => {
    const result = stackSvgsHorizontally([redCircle]);
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("stacks SVGs with viewBox attribute", async () => {
    const result = stackSvgsHorizontally([svgWithViewBox, redCircle]);
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });
});

describe("stackSvgsVertically", () => {
  test("stacks two identical circles vertically", async () => {
    const result = stackSvgsVertically([redCircle, redCircle]);
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("stacks two identical circles vertically with gap", async () => {
    const result = stackSvgsVertically([redCircle, redCircle], { gap: 20 });
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("stacks three different shapes vertically", async () => {
    const result = stackSvgsVertically([redCircle, blueSquare, greenTriangle]);
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("handles empty array", () => {
    const result = stackSvgsVertically([]);
    expect(result).toBe('<svg width="0" height="0" viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg"></svg>');
  });

  test("handles single SVG", async () => {
    const result = stackSvgsVertically([redCircle]);
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("stacks SVGs with viewBox attribute", async () => {
    const result = stackSvgsVertically([svgWithViewBox, redCircle]);
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });
});

describe("viewBox handling", () => {
  test("SVG with only viewBox (no width/height)", async () => {
    const result = stackSvgsHorizontally([svgWithViewBox, svgWithViewBox], {
      gap: 10,
    });
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("SVG with both viewBox and dimensions uses width/height for sizing", async () => {
    const result = stackSvgsVertically([
      svgWithViewBoxAndDimensions,
      svgWithViewBoxAndDimensions,
    ]);
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("complex viewBox scenario with offset coordinate system", async () => {
    const svgWithOffset = `<svg viewBox="10 10 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="40" fill="magenta" />
</svg>`;
    const result = stackSvgsHorizontally([svgWithOffset, redCircle], {
      gap: 5,
    });
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });
});

describe("edge cases", () => {
  test("shapes with different heights center vertically", async () => {
    const result = stackSvgsHorizontally([redCircle, tallRectangle]);
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("shapes with different widths center horizontally", async () => {
    const result = stackSvgsVertically([redCircle, wideRectangle]);
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("large gap values", async () => {
    const result = stackSvgsHorizontally([redCircle, blueSquare], {
      gap: 500,
    });
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("many SVGs horizontally", async () => {
    const result = stackSvgsHorizontally(
      [redCircle, blueSquare, greenTriangle, redCircle, blueSquare],
      { gap: 5 }
    );
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });

  test("SVG with complex attributes and gradients", async () => {
    const complexSvg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
    </linearGradient>
  </defs>
  <ellipse cx="50" cy="50" rx="40" ry="30" fill="url(#grad1)" />
</svg>`;
    const result = stackSvgsHorizontally([complexSvg, redCircle]);
    await expect(result).toMatchSvgSnapshot(import.meta.path);
  });
});
