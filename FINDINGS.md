# Findings: Full-Stack Personal Hygiene E-Commerce Platform

Research only — no design decisions, no code. **Date:** 2026-08-15

## 1. How this kind of platform is usually built

Baseline: one Next.js (App Router, Server Components) + TypeScript + Tailwind/shadcn app, backed by Supabase (Postgres + Storage + CDN), deployed to Vercel. Storefront and admin are route groups in one app (`/` and `/admin`).

- **7-page storefront:** Home → Shop (catalog/filter/search) → Product detail (variants, images) → Cart → Checkout → Account (profile/orders/addresses) → About/Contact/FAQ. Catalog pages server-rendered (SEO, fast LCP); cart/checkout client-interactive.
- **Data model (~15-18 tables):** users, categories, products, variants, images, inventory, carts + cart_items, orders, order_items, addresses, coupons, coupon_usages, refunds. Order line items snapshot name/SKU/price so later product edits never rewrite history.
- **Flow:** browse → cart (client state; guest carts in localStorage, DB carts for signed-in) → server creates order + Stripe Checkout Session/PaymentIntent → webhook (`checkout.session.completed`/`payment_intent.succeeded`) marks paid, decrements stock, sends confirmation email → admin fulfills.
- **Auth (2026):** Better Auth is the new-project default — TypeScript-native, self-hosted, owns user/session tables in your Postgres; it absorbed Auth.js (now maintenance-only). Admin access via Better Auth's admin/RBAC plugin or a role column + server-side checks.
- **Email:** React Email + Resend (or Postmark). **Payments:** Stripe; Checkout Sessions preferred over PaymentIntents (less code, built-in coupons/tax/address).
- **Bundles:** *bundle-as-product* (a SKU grouping components at a fixed price) or *promotion engine* (cart rules: BOGO, mix-and-match, volume breaks).

## 2. Approaches & trade-offs

| Decision | Options | Trade-off |
|---|---|---|
| Auth | Better Auth vs Supabase Auth vs Clerk | Better Auth: owns your data, no per-MAU fees, but you build UI and it bypasses Supabase's RLS. Supabase Auth: cheap, JWT+RLS integrated, least portable. Clerk: fastest, prebuilt UI, vendor lock + fees. |
| Data access | Server-side only (Drizzle/Prisma + server actions) vs client SDK + RLS | RLS is elegant but dangerous for money flows; orders/prices must be re-validated server-side regardless. |
| Payments | Stripe Checkout vs PaymentIntents vs regional (Paystack, Razorpay, Alipay/WeChat) | Checkout = less code, lower PCI scope, hosted page. PaymentIntents = full UI control, much more work. Regional matters outside NA/EU. |
| Email | Resend vs Postmark vs SES vs SendGrid | Resend best DX; Postmark best deliverability; SES cheapest at volume but self-managed reputation; SendGrid good for transactional + marketing. |
| Bundles | Bundle-as-product vs promotion engine | Bundle: simple, but needs stock sync across component SKUs + order-item expansion. Promotion engine: flexible but you build a discount engine (scope-creep risk). |
| Build vs buy | Custom Next.js vs headless (Shopify Hydrogen/Medusa) vs turnkey (Shopify/WooCommerce) | Custom = full control over auth/data/bundles, you own tax/payments/security. Turnkey = fastest; the requested stack implies custom. |

## 3. Fit with existing project

Greenfield. Repo contains only `CLAUDE.md` (engineering constitution: clean code, security/performance non-negotiable, continuous testing, docs, end-to-end ownership). No code, schema, or framework decisions exist to conform to. Dev env is Windows/PowerShell — no impact on the stack.

## 4. Failure modes & edge cases to worry about

- **Payments:** double charges (idempotency keys + DB unique constraint on webhook event ID); Stripe retries up to 3 days, events can arrive duplicated/out of order; verify webhook signatures; never trust client-submitted totals — recompute server-side; refunds/disputes/3DS; expired checkout sessions; price drift between cart and charge.
- **Inventory:** last-unit oversell under concurrency (atomic `UPDATE ... WHERE quantity > 0` or row lock); restocks; negative stock; bundle vs component stock divergence.
- **Auth/security:** server-side role checks (not just hidden UI); session expiry/revocation; CSRF; RLS misconfig leaks; never ship the Supabase service-role key to the client. Note: the Better Auth↔Supabase JWT bridge is an immature community plugin — relevant if signed-in users must hit Supabase's REST API directly.
- **Orders:** duplicate order rows on retry; one state machine (pending → paid → fulfilled / failed / refunded); partial/cancelled orders; abandoned-cart recovery requires DB-backed carts.
- **Promos/bundles:** discount stacking (bundle + coupon + shipping), multi-account coupon farming, per-user/per-order limits, expired bundle in an active cart, margin erosion.
- **Email:** spam/deliverability (SPF/DKIM/DMARC), duplicate sends from duplicate webhooks, provider downtime.
- **Domain (personal hygiene):** consumables → ingredient/allergen listings, expiry/batch tracking; aerosols/sprays can be restricted to ship; hygiene items are often non-returnable — policy + checkout messaging needed; region-dependent tax.
- **Ops:** Next.js caching serving stale prices; rate-limit checkout; image cache invalidation after photo updates.

## 5. What's still unknown

1. **Target market / currency / region** — decides payment provider, tax, shipping.
2. **Payment provider** — Stripe assumed; Alipay/WeChat/Paystack change the design.
3. **Bundle semantics** — fixed kits, build-your-own, or BOGO/volume promos?
4. **Guest checkout vs account-required** — materially changes cart + email design.
5. **Inventory depth** — variants, batch/expiry tracking, multi-warehouse?
6. **Scale expectations** — product count, order/concurrency volume (drives caching + DB planning).
7. **Shipping/fulfillment** — carriers, rate tables, free-shipping thresholds?
8. **Admin needs** — single operator vs staff with different roles?
9. **Email volume** — provider choice (Resend vs Postmark vs SES).
10. **Compliance** — GDPR, tax nexus, returns policy, product-line regulatory constraints.
