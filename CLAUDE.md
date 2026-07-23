# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout: two separate Next.js apps

This repo contains **two independent applications** with different frameworks, package managers, and purposes. Confirm which one a task targets before editing.

| | Root (`/`) | `Glindent-Headless/` |
|---|---|---|
| Purpose | Standalone marketing/design prototype | **The live ikas storefront theme** |
| Next.js | 16, App Router (`app/`) | 12, Pages Router (`src/pages/`) |
| React | 19 | 17 (pinned via `resolutions`) |
| Styling | Tailwind 4 + shadcn/ui | Inline `CSSProperties` + `styled-jsx` |
| Data | Static `lib/products.ts` | ikas GraphQL via `@ikas/storefront` |
| Package manager | npm/pnpm (`.npmrc` sets `legacy-peer-deps`) | **yarn only** — ikas does not support others |

E-commerce work (products, cart, checkout, accounts) belongs in `Glindent-Headless/`. The root app has its own local cart context and product list that are **not** connected to ikas.

Also at root: Python scripts (`excel_to_ikas.py`, `create_ikas_import_*.py`, `upload_to_cloudinary.py`) that convert `Glindent Web Page.xlsx` into ikas product-import CSVs and push extracted images to Cloudinary. These are one-off data-migration tooling, not part of either app's build.

## Commands

### ikas theme (`Glindent-Headless/`)

```bash
cd Glindent-Headless
yarn install
yarn dev        # next dev -p 3333  — the port the ikas editor expects
yarn build      # next build
yarn generate   # ikas --generate — regenerates src/components/__generated__/
yarn prettier:all
```

Deploying is manual: `yarn build`, then click "Tema Yükle" in the ikas panel.

### Root app

```bash
npm run dev     # next dev
npm run build
npx tsc --noEmit
```

`npm run lint` is declared but there is no eslint config or dependency installed — it will fail. Neither app has a test suite; verification is `tsc --noEmit` plus a build.

## ikas integration essentials

### Credentials and config

`Glindent-Headless/config.json` holds `themeId`, `storefrontId`, `apiKey`, `themeSecret` and **is committed to git**. It is read at module scope in `src/pages/_app.tsx`:

```ts
IkasStorefrontConfig.init({ ...Config, apiUrl: process.env.NEXT_PUBLIC_GQL_URL, cdnUrl: process.env.NEXT_PUBLIC_CDN_URL });
```

`.env` (also committed) supplies the ikas API endpoints. Store settings cached by the CLI land in `.ikas/` (gitignored). The storefront's ikas-side defaults are locale `tr` / currency `GBP`, while `next.config.js` pins the Next i18n locale to `en` — copy in components is hardcoded English, and `products-section` carries a Turkish→English map for variant type/value names coming from the ikas catalog.

### Theme editor + local dev loop

The ikas panel editor renders **your localhost** in an iframe:

```
https://dev-glindent.myikas.com/admin/storefront/partner/theme/edit
```

`yarn dev` must be running on 3333 for this to work. The editor talks to the local API routes under `src/pages/api/` (`getTheme`, `updateTheme`, `getConfig`, `getComponentDirs`, `uploadTheme`) — these are thin re-exports of `IkasLocalThemeAPI` from `@ikas/storefront-next`; do not add logic to them. `tsconfig.json` excludes `src/pages/api` from type-checking.

### Generated component registry — never hand-edit

`src/components/__generated__/` is produced by `ikas --generate` (`yarn generate`) from the component definitions you create in the ikas theme editor:

- `types.ts` — prop types for each component, derived from the panel's field definitions
- `editor.tsx` — UUID → dynamic import map for every component
- `pages/*.ts` — UUID → component map per route

The panel assigns a UUID to each component and binds it to a directory under `src/components/`. Adding a panel-editable prop is a two-step flow: declare the field in the editor, then run `yarn generate` to refresh `types.ts`. Editing these files by hand is overwritten on the next generate.

### Component rules

ikas-registered components (anything in `__generated__`) must:

1. Be wrapped in `observer()` from `mobx-react-lite` — ikas state is MobX, and without it the component won't react to cart/customer changes.
2. Use inline `CSSProperties` objects for styling. CSS Modules and `styled-jsx` do **not** apply inside the ikas render tree. The exception is the layout wrappers (`src/layouts/*`, `horizontal-layout/`), which are mounted by `_app.tsx` rather than by ikas and do use `<style jsx global>`.
3. Take all merchant-editable content as optional props with defaults, so the panel can override them.

Store access is `const store = useStore()` from `@ikas/storefront`: `store.cartStore` (`addItem`, `removeItem`, `changeItemQuantity`, `saveCouponCode`), `store.customerStore.customer`.

Page files under `src/pages/` are boilerplate that pair an ikas page component with its generated component map, e.g.:

```tsx
const PageComponent = IndexPage.default;
const Page = (props: any) => <PageComponent components={Components} {...props} />;
export const getStaticProps = IndexPageNext.getStaticProps;
```

`checkout.tsx` deliberately uses ikas's default checkout with no custom components. Link to `/checkout` directly rather than `store.cartStore.checkoutUrl`, which can be empty.

### next.config.js constraints

`reactStrictMode: false` is required for ikas compatibility. All `@ikas/*` packages ship untranspiled and go through `next-transpile-modules`; adding a new `@ikas/*` dependency means adding it to that list. Node built-ins are stubbed out via webpack `resolve.fallback` for the client bundle.

`.babelrc` disables SWC (you'll see the notice on every `next dev`). That costs build speed and rules out `compiler.removeConsole`, so **nothing strips `console.*` from production** — don't leave diagnostic logging in committed code. The file is part of the ikas scaffold and the theme builds on ikas's servers, so removing it to regain SWC is riskier than it looks. Likewise `styled-components` is an unused dependency but stays for the same reason.

### The "153 kB page data" build warning is expected

`next dev`/`next build` warn that `/` exceeds Next's 128 kB page-data threshold. Measured breakdown: `pageProps.propValues` is ~150 kB, of which ~148 kB is the `productList` bound to products-section — full ikas product objects (variants, `metaData`, `salesChannels`, description HTML) for every product in the list. ikas's own `getStaticProps` produces this; trimming it in theme code breaks the panel binding. The only real lever is lowering the product-list limit in the ikas editor, which is a merchandising decision. Don't chase this in code.

## Architecture of the storefront theme

### Dual layout system

`_app.tsx` branches on route:

- `/` → `MainLayout` + `NavigationProvider` — a **horizontal** scroll experience. Five full-viewport sections (Hero, About, Products, FAQ, Contact) laid out in a flex row and translated with Framer Motion; driven by wheel, touch swipe, and arrow keys. Locks `html`/`body` to `overflow: hidden`.
- everything else → `DefaultLayout` — normal vertical scroll, restores overflow, adds page transition variants.

Each layout injects and tears down its own global CSS on mount/unmount, so a layout that leaks styles is the usual cause of "scroll broken on cart page" symptoms. Both do extensive per-platform viewport handling (iOS `--vh` custom property, Android overscroll, Safari `-webkit-fill-available`).

`NavigationProvider` exposes `useNavigation()`, but because ikas renders panel components outside the provider's React tree, it falls back to module-level globals plus a `glindent-navigation` CustomEvent bus. Components outside the homepage tree navigate by dispatching a `navigateToSection` event or writing `sessionStorage.targetSection` before routing to `/`.

### Products section

`src/components/products-section/index.tsx` is the largest component and holds the product grid, filter sidebar, quick-view modal, and toast. Notable behaviors:

- Products come from the `productList` prop that ikas passes in (bound in the panel), read through `src/hooks/use-all-products.ts`. Filtering, sorting, and pagination are all client-side over that array — there is no custom GraphQL.
- `use-all-products.ts` builds a category tree from `product.categories`/`categoryPathItems` and shows the **top 3 root categories by product count**. If ikas returns no categories at all, it synthesizes Labside / Chairside / Medical Devices buckets from keyword matching on product names. This hook is very verbose with `console.log` diagnostics.
- **Add to cart requires login** — unauthenticated users are toasted and redirected to `/account/login`. This is a deliberate B2B rule, not a bug.
- Prices are read from raw `variant.price.buyPrice`/`sellPrice` and formatted manually, because the ikas `formatted*` getters were unreliable here. Falls back to "Contact for price".
- `src/lib/product-images.ts` accepts only real ikas CDN URLs; anything falsy, a data URI, or `/placeholder.svg` degrades to `/glindent-logo.png`, which callers then render with `objectFit: contain`.

### Image sizing — `IkasImage.src` is always 1080px

`IkasImage` (`node_modules/@ikas/storefront/build/models/data/image/index.d.ts`) exposes three accessors, and the difference matters:

```ts
get src(): string;          // → getDefaultSrc → ALWAYS the 1080px rendition
get thumbnailSrc(): string; // → 180px
getSrc: (size: number) => string;
```

Reaching for `.src` in a grid card or a 64px thumbnail over-fetches badly. The CDN encodes the width in the path and serves `180 / 360 / 540 / 720 / 900 / 1080 / 1296` (anything else 404s), in two shapes depending on whether the original filename survived:

```
.../{imageId}/image_540.webp
.../{imageId}/540/dsc01143.webp
```

`src/lib/product-images.ts` exports `resizeIkasImage(url, size)` which rewrites either shape and snaps to the nearest supported width; `getProductMainImage` / `getProductGalleryImages` take an optional size argument. Non-ikas URLs pass through untouched. Prefer these over hand-built URLs, and pick the width the slot actually paints.

`next/image` is used with `unoptimized` everywhere on purpose — `cdn.myikas.com` is not in `next.config.js` `images.domains`, so removing the flag breaks the build. The CDN already serves webp, so Next's optimizer adds nothing.

### Brand

Teal→cyan gradient (`#0d9488 → #0891b2 → #06b6d4`), dark text `#111827`, secondary `#6b7280`. Cards use 20px radius; primary buttons 14px radius, 56px height, gradient fill.

## Reference docs in the repo

- `copilot-instructions.md` (root, ~80KB) — the fullest account of the ikas integration: store API reference, component patterns, styling tokens, troubleshooting, change log.
- `Glindent-Headless/LAYOUT_SYSTEM.md` — layout routing and the specific bugs the two-layout split fixed.
- `Glindent-Headless/PRODUCTS_SECTION_DOCS.md`, `WELCOME_MODAL_*.md`, `QUICK_START.md` — feature-level notes (several are written in Turkish).
