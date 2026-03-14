# Bank of Asia Online — Public Marketing Website Design Brief

> Reference this file in every prompt. All design decisions must align with this brief.

---

## Design DNA

### Layout & Fluidity
- **Reference**: wallester.com — full-bleed sections, dark backgrounds, animated floating cards
- Content stretches to **~90vw max** (not the typical 1280px box), like wallester + beyondbank
- Sections bleed edge-to-edge; inner content uses generous horizontal padding

### Structure & Page Depth
- **Reference**: beyondbank.com.au — mega menus, real institutional content, deep page hierarchy
- Every page has substantial content depth — no thin marketing fluff

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--boa-navy` | `#0A1628` | Primary background, hero sections |
| `--boa-teal` | `#00C896` | Accent, CTAs, highlights, active states |
| `--boa-gold` | `#C8972A` | Premium highlights, tier badges |
| White | `#FFFFFF` | Text on dark, card backgrounds |
| Muted | `#8899B4` | Secondary text on dark backgrounds |

### Typography
| Font | Usage | Weights |
|------|-------|---------|
| **Syne** | Display headings, hero H1/H2 | 700, 800 |
| **DM Sans** | Body copy, UI labels, nav | 400, 500, 600 |
| **JetBrains Mono** | Numbers, rates, amounts, codes | 400, 500 |

### Animations — Framer Motion Throughout
- Stagger reveal on section entry (children animate in sequence)
- Floating elements on hero (subtle y-axis oscillation, infinite loop)
- Slide-in from bottom/left on scroll entry
- Number counters animate on viewport entry
- Card hover: lift + subtle glow
- No CSS-only animations for interactive elements — use Framer Motion

### Hero Sections
- **80% of pages** must have a rich, busy hero with rotating/floating UI card visuals on the right side
- Left side: headline + subtext + CTAs
- Right side: floating dashboard card mockups, currency widgets, transaction lists, etc.
- Dark navy background (#0A1628) with subtle gradient or grid pattern

---

## Logo
- **Primary**: `https://i.imgur.com/BbHaV56.png` (transparent background — test on dark)
- **Fallback**: `https://i.imgur.com/SQSZD9i.png`
- Use `<Image>` from `next/image` with appropriate `width`/`height`/`alt`

---

## Navbar

### Top Utility Bar — BOTH SIDES BUSY
- **Left side**: regulatory/trust signals (e.g. "FDIC Insured · PCI DSS Level 1 · Licensed by MAS")
- **Right side**: utility links (Help, Rates, Locations, Language selector)
- Both sides must be populated — not just the right side

### Main Nav Row
- Full mega-menu system (beyondbank.com.au depth)
- Sticky, scroll-aware
- Logo left, nav centre, CTAs right

---

## Footer
- **Reference**: wallester.com footer — rich, 6-column, dark, busy
- Dark navy background
- Columns: Products | Personal | Business | Company | Legal | Support/Contact
- Bottom compliance bar: regulatory text, certifications, copyright
- **No social media icons** — replace with:
  - App Store / Google Play badges
  - Trust/regulatory badges (FDIC, PCI DSS, MAS)
  - Security certifications

---

## Geography & Naming
- **No Nigerian references anywhere** — not in names, flags, currencies, or copy
- Names used in mockups: Singapore + USA names only (e.g. James Chen, Sarah Mitchell, Wei Ling)
- No NGN (Nigerian Naira) in any currency list on public pages

---

## Currency Lists (Public Pages)
Supported 10 currencies — **NGN excluded**:
`USD · AUD · EUR · GBP · JPY · SGD · HKD · CAD · CHF · NZD`

---

## Key Anti-Patterns (Never Do)
- No social media share/follow buttons
- No NGN flag or currency
- No Nigerian names in any mockup data
- No thin/empty hero sections (every hero needs floating UI visuals)
- No narrow content containers — stretch to ~90vw
- No CSS-only animations for anything interactive (use Framer Motion)
- No placeholder "lorem ipsum" — all copy must be real banking content
