# Design System Strategy: The PR Authority

## 1. Overview & Creative North Star
This design system moves away from the sterile, modular appearance of traditional B2B SaaS and moves toward a **"High-End Editorial"** North Star. We treat every screen like a premium digital publication—blending the urgency of a newsroom with the sophistication of a luxury brand.

We reject the "boxed-in" look. By using intentional asymmetry, overlapping layers, and a typography scale that favors dramatic contrast, we create an experience that feels curated rather than generated. This system is designed for a PR and launch service that values precision, narrative, and bold impact.

---

## 2. Colors & Surface Philosophy

The palette is anchored by a deep, authoritative `primary` red and a high-voltage `tertiary` violet, balanced against a warm, paper-like `background`.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. They create visual friction and look "cheap." Instead, boundaries must be defined through:
- **Tonal Shifts:** Transitioning from `surface` to `surface-container-low`.
- **Negative Space:** Using expansive white space to denote the end of a narrative block.
- **Color Blocks:** Utilizing full-bleed `secondary_container` or `primary` sections to pivot the user's attention.

### Surface Hierarchy & Nesting
Treat the UI as a physical desk of stacked materials. 
1. **Base Layer:** `surface` (#fafaf5) – the canvas.
2. **Structural Blocks:** `surface_container_low` (#f4f4ef) – for grouping related content.
3. **Interactive Cards:** `surface_container_lowest` (#ffffff) – the highest "lift," used for actionable items like pricing or launch kits.

### The "Glass & Gradient" Rule
To inject "soul" into the B2B context:
- **Glassmorphism:** Use `surface` colors at 70% opacity with a `24px` backdrop blur for navigation bars and floating action menus. This allows the vibrant brand colors to bleed through as the user scrolls.
- **Signature Gradients:** For high-impact CTAs, use a subtle linear gradient from `primary` (#a0220b) to `primary_container` (#c23b22). This provides a tactile, "lit-from-within" quality.

---

## 3. Typography: Editorial Authority

We use a tri-font strategy to balance character with readability.

*   **Display & Headlines (Plus Jakarta Sans):** These are our "shout" moments. We use large scales (`display-lg` at 3.5rem) with tight letter-spacing to create a "hip" B2B feel that demands attention.
*   **Titles & Body (Inter):** The workhorse. Inter provides a clean, neutral balance to the expressive headlines. Use `body-lg` (1rem) for general copy to ensure a premium, readable density.
*   **System & Technical (Space Grotesk):** Reserved for `labels`. Its monospaced influence suggests precision—perfect for metadata, launch dates, or "Kit ID" numbers.

---

## 4. Elevation & Depth

We achieve hierarchy through **Tonal Layering** rather than drop shadows.

*   **The Layering Principle:** Instead of adding a shadow to a card, place a `surface_container_lowest` (pure white) card onto a `surface_container` (off-white) background. The subtle shift in hex value creates a modern, sophisticated lift.
*   **Ambient Shadows:** If an element must float (e.g., a modal or a primary floating button), use a shadow tinted with the `on_surface` color: `box-shadow: 0 20px 40px rgba(26, 28, 25, 0.06)`. This mimics soft, natural gallery lighting.
*   **The "Ghost Border" Fallback:** If a container sits on a background of the exact same color, use a 1px border with `outline_variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** A pill-shaped (`full` roundedness) gradient of `primary` to `primary_container`. No border. White text.
*   **Secondary:** `surface_container_highest` background with `on_surface` text. For an "editorial" look, use a `md` roundedness (0.375rem).
*   **Tertiary:** Transparent background, `tertiary` text color, with a subtle underline on hover.

### Input Fields
*   **Styling:** Large padding (1rem). Background set to `surface_container_low`. 
*   **Interaction:** On focus, the background shifts to `surface_container_lowest` and a 2px "Ghost Border" appears in `tertiary`.

### Cards & Lists
*   **The "Anti-Divider" Rule:** Never use horizontal lines to separate list items. Use 24px–32px of vertical padding and a background shift on hover to `surface_container_high`.
*   **Media Cards:** Incorporate high-quality imagery with a `lg` (0.5rem) corner radius. Overlap text elements (using `title-lg`) slightly over the image edge to break the grid.

### Specialty Component: The "Status Badge"
For PR tracking (e.g., "In Review," "Published"), use the `label-md` scale in `tertiary_container` with `on_tertiary_container` text. Use a `full` roundedness to make them look like high-end tactile chips.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts. A 60/40 split for hero sections feels more bespoke than a centered 50/50.
*   **Do** embrace the "paper" feel of the background (`#fafaf5`). Pure white should only be used to highlight specific cards.
*   **Do** use `tertiary` (Electric Violet) for subtle accents—like a single word in a headline or a notification dot—to keep the system feeling "hip."

### Don’t:
*   **Don't** use 100% black. Use `on_surface` (#1a1c19) for text to maintain a high-end, soft-contrast feel.
*   **Don't** use "standard" shadows. Avoid any shadow that looks like a dark grey smudge; if you can see the shadow clearly, it’s too heavy.
*   **Don't** overcrowd. If a section feels busy, double the padding. This system relies on "The Luxury of Space."