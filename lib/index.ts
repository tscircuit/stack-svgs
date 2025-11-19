interface StackOptions {
  gap?: number;
}

interface ParsedSvg {
  width: number;
  height: number;
  viewBox?: string;
  content: string;
  attributes: Record<string, string>;
}

function parseSvg(svgString: string): ParsedSvg {
  const svgMatch = svgString.match(/<svg([^>]*)>/);
  if (!svgMatch) {
    throw new Error("Invalid SVG string");
  }

  const attributes: Record<string, string> = {};
  const attributeString = svgMatch[1];

  // Extract all attributes
  const attrRegex = /(\w+(?:-\w+)*)="([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = attrRegex.exec(attributeString)) !== null) {
    attributes[match[1]] = match[2];
  }

  // Extract dimensions
  let width = 0;
  let height = 0;
  let viewBox: string | undefined;

  if (attributes.viewBox) {
    viewBox = attributes.viewBox;
    const viewBoxParts = viewBox.split(/\s+/);
    width = Number.parseFloat(viewBoxParts[2] || "0");
    height = Number.parseFloat(viewBoxParts[3] || "0");
  }

  if (attributes.width) {
    width = Number.parseFloat(attributes.width);
  }

  if (attributes.height) {
    height = Number.parseFloat(attributes.height);
  }

  // Extract content (everything between <svg> and </svg>)
  const contentMatch = svgString.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const content = contentMatch ? contentMatch[1].trim() : "";

  return { width, height, viewBox, content, attributes };
}

export function stackSvgsHorizontally(
  svgs: string[],
  options: StackOptions = {}
): string {
  const gap = options.gap ?? 0;

  if (svgs.length === 0) {
    return '<svg width="0" height="0" viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg"></svg>';
  }

  const parsedSvgs = svgs.map((svg) => parseSvg(svg));

  // Calculate total width and max height
  const totalWidth =
    parsedSvgs.reduce((sum, svg) => sum + svg.width, 0) +
    gap * (parsedSvgs.length - 1);
  const maxHeight = Math.max(...parsedSvgs.map((svg) => svg.height));

  // Build combined SVG
  let currentX = 0;
  const groups: string[] = [];

  for (const svg of parsedSvgs) {
    const yOffset = (maxHeight - svg.height) / 2; // Center vertically
    groups.push(
      `  <g transform="translate(${currentX}, ${yOffset})">\n    ${svg.content}\n  </g>`
    );
    currentX += svg.width + gap;
  }

  // Preserve xmlns from first SVG or use default
  const xmlns =
    parsedSvgs[0]?.attributes.xmlns || "http://www.w3.org/2000/svg";

  return `<svg width="${totalWidth}" height="${maxHeight}" viewBox="0 0 ${totalWidth} ${maxHeight}" xmlns="${xmlns}">
${groups.join("\n")}
</svg>`;
}

export function stackSvgsVertically(
  svgs: string[],
  options: StackOptions = {}
): string {
  const gap = options.gap ?? 0;

  if (svgs.length === 0) {
    return '<svg width="0" height="0" viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg"></svg>';
  }

  const parsedSvgs = svgs.map((svg) => parseSvg(svg));

  // Calculate max width and total height
  const maxWidth = Math.max(...parsedSvgs.map((svg) => svg.width));
  const totalHeight =
    parsedSvgs.reduce((sum, svg) => sum + svg.height, 0) +
    gap * (parsedSvgs.length - 1);

  // Build combined SVG
  let currentY = 0;
  const groups: string[] = [];

  for (const svg of parsedSvgs) {
    const xOffset = (maxWidth - svg.width) / 2; // Center horizontally
    groups.push(
      `  <g transform="translate(${xOffset}, ${currentY})">\n    ${svg.content}\n  </g>`
    );
    currentY += svg.height + gap;
  }

  // Preserve xmlns from first SVG or use default
  const xmlns =
    parsedSvgs[0]?.attributes.xmlns || "http://www.w3.org/2000/svg";

  return `<svg width="${maxWidth}" height="${totalHeight}" viewBox="0 0 ${maxWidth} ${totalHeight}" xmlns="${xmlns}">
${groups.join("\n")}
</svg>`;
}
