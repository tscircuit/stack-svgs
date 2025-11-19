# stack-svgs

Stack SVGs horizontally or vertically

## Usage

```tsx
import { stackSvgsHorizontally, stackSvgsVertically } from "stack-svgs"

const stackedSvgString = stackSvgsHorizontally(
  [
    `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
  </svg>`,
    `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
  </svg>`,
  ],
  {
    gap: 10,
  }
)
```
