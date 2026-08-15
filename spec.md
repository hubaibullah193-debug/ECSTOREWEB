# Spec — Khan Glowcare Center (Pakistan)

**Product:** an online store for personal hygiene products (oral care, body wash, deodorants, skincare, and similar consumables), serving customers in **Pakistan in Pakistani rupees (PKR)**. It has a 7-page customer storefront, an admin panel/dashboard, authentication, WhatsApp/SMS/email notifications, payments (**JazzCash, Easypaisa, Cash on Delivery**), and fixed pre-made bundle kits.

> This spec describes **behavior only**. Databases, frameworks, libraries, and file layout are deliberately out of scope. A requirement is written so that a build which ignores it fails visibly.
>
> Confirmed decisions (from owner interview): Pakistan-only market; PKR with whole-rupee amounts; payments = JazzCash + Easypaisa + COD; flat nationwide shipping with no COD fee, no free-shipping threshold, no minimum order; phone required at checkout, email optional; accounts optional; bundle offers are fixed kits; variants with tracked stock; tax-inclusive prices; admin-approved cancellations; single admin; small shop (a few dozen products).

---

## 1. Goal (the why)

- **Sell consumables directly to Pakistani consumers.** Customers discover, evaluate, buy, and track hygiene products online with minimal friction, on any device.
- **Remove the biggest checkout killers.** Guests must be able to complete a purchase without creating an account; totals must never surprise; failed payments must be recoverable.
- **Meet how Pakistan actually buys.** Cash on delivery is the default expectation, phone numbers are the primary contact, and WhatsApp is the dominant messaging app. The store must work for customers who have no email and no account.
- **Let a single operator run the store without a developer.** Catalog, stock, bundles, and orders are managed from an admin panel. Day-to-day operations (add a product, fix a price, change stock, update an order, approve a cancel, issue a refund) require no code.
- **Use bundles to raise order value without eroding trust.** Pre-made kits sold at a discount exist to increase average order value and move related products together — and the customer must always see exactly what they save.
- **Be reliable with money.** No double charges, no oversold stock, totals that match from cart to delivery, and order history that never changes retroactively.

---

## 2. Users & roles

| Role | What they can do |
|---|---|
| **Guest** (signed out) | Browse, search, add to cart, check out with any payment method, look up an order by phone + order number, receive order updates |
| **Customer** (signed in, account optional) | Everything a guest can, plus persistent cart, address book, order history, reorder, request cancellation |
| **Admin** (single operator) | Everything a customer can, plus the admin panel: catalog, variants, stock, bundles, orders, cancellation approval, returns, refunds, dashboard, contact inbox |

All data (catalog, carts, orders, accounts, stock, images) persists across sessions, restarts, and deployments. No stored data is lost when the server restarts or the app is redeployed.

---

## 3. User scenarios

**S1 — Guest COD purchase.** A visitor arrives at the Home page, opens a product from the Shop, adds it to the cart, checks out choosing **Cash on Delivery**, enters their phone number and a delivery address, and places the order. They see a confirmation page with an order number. No account, no email, and no payment was needed. They receive an order confirmation by WhatsApp (or SMS if their number is not on WhatsApp). The admin is pinged and ships the order; the customer is notified when it ships and when it is delivered.

**S2 — Wallet purchase.** A customer chooses **JazzCash** at checkout, pays through the wallet flow, and the order is created only after the payment is confirmed. The total charged equals the total shown. If the payment fails, nothing is charged and they can retry the same order.

**S3 — Returning customer.** A signed-in customer adds items on their phone, later finds the same cart on their laptop, places an order, and tracks it in their order history. They can reorder with two clicks.

**S4 — Bundle buyer.** A customer sees a bundle kit on the Home page, opens its product page, sees the components and the savings, and adds the whole kit as one item. At checkout the breakdown shows the components, the bundle price, and the amount saved.

**S5 — Fulfilment & returns.** The admin sees a new paid order, ships it, and the customer is notified. A COD customer refuses the package at the door; the admin marks the order returned, the items go back to stock, and the order is closed with nothing to refund.

**S6 — Cancellation.** A customer requests to cancel an order that is still pending. The admin approves, the items are restocked, and if the order was paid online the money is refunded. The customer is notified.

**S7 — Recovery after failure.** A customer's JazzCash payment is declined. They see a clear message, switch to COD (or retry the wallet), and complete the same order. Nothing was charged, nothing was lost.

---

## 4. Functional requirements

### 4.1 Storefront — seven pages

- **FR-1.1** The storefront has exactly these customer-facing pages, all reachable from the main navigation:
  1. **Home** — hero, featured products, featured bundles, categories.
  2. **Shop** — the full product catalog with category filter, sorting, and search. Each entry shows name, image, price, and availability.
  3. **Product detail** — image gallery, variants, description, ingredients/allergens list, price, bundle savings (if a bundle), availability, quantity selector, add-to-cart. One page per product; deep links work.
  4. **Cart** — all added items, quantities, per-item price, bundle savings, subtotal, shipping, total, proceed-to-checkout.
  5. **Checkout** — contact details (phone required, email optional), delivery address, shipping, order summary, payment method selection, place order.
  6. **Account** — sign in/up (email/password or Google), profile, address book, order history, order detail, reorder, request cancellation.
  7. **About & Contact** — store info and a contact form that reaches the admin.
- **FR-1.2** A separate **order status lookup** lets a guest enter their order number + phone number and see the order's current status, items, and totals. It is reached from the footer and the order confirmation page. This is a utility, not one of the seven main pages.
- **FR-1.3** Product and Shop pages must never show a price or stock level older than one minute from the catalog. A price or stock change saved in the admin panel is visible to customers within one minute without clearing the browser cache.
- **FR-1.4** The catalog must stay fast and usable for a shop of a few dozen products: Shop and product pages render complete and interactive within 3 seconds on a mid-range phone over a slow connection, and every image on the page displays in its correct aspect ratio without layout shift.
- **FR-1.5** Search returns products whose name or description matches the query, with exact matches first. Search and category filters can be combined.
- **FR-1.6** All prices are shown in PKR with a consistent symbol (Rs) and whole-rupee amounts. A price is never shown in a different currency or with hidden fractional amounts.

### 4.2 Cart

- **FR-2.1** Any item can be added to the cart, its quantity changed, it can be removed, and the cart can be cleared. A cart icon always shows the correct item count.
- **FR-2.2** A guest's cart survives closing the browser on the same device. A signed-in customer's cart is the same on every device they sign in from, and is restored the next time they sign in.
- **FR-2.3** The cart always recomputes prices and bundle savings from current catalog prices. If an item's price changed since it was added, the cart shows the new price and a visible notice.
- **FR-2.4** No one can add more of an item than its available stock, and no one can add a bundle in a quantity exceeding the lowest stock among the bundle's components (see 4.6).
- **FR-2.5** For a bundle in the cart, the line shows the components, the bundle price, and the amount saved compared to buying the components separately.

### 4.3 Checkout, orders & payments

- **FR-3.1** Checkout works for guests with every payment method — no account and no email required. If a signed-in customer checks out, the order is linked to their account.
- **FR-3.2** Checkout requires: name, a valid Pakistani mobile phone number, and a delivery address (address lines, city, region, postal code, country = Pakistan). Email is optional. Phone is validated as a Pakistani mobile number at entry (e.g., `03XX-XXXXXXX` or `+92 3XX-XXXXXXX`); an invalid number produces a clear error and blocks submission.
- **FR-3.3** The checkout summary shows every item, quantity, unit price, bundle savings, shipping, and the total in PKR. The customer chooses one of: **Cash on Delivery**, **JazzCash**, or **Easypaisa**. The total shown is the total collected — no additional fees are added for choosing COD (no COD handling fee, no surprise charges).
- **FR-3.4** For **JazzCash** and **Easypaisa**, the order is created only after the wallet provider confirms the charge succeeded — never when the customer's browser merely redirects back. If the payment is declined, fails, or is abandoned, no order is created, nothing is charged, and the customer can retry the same checkout.
- **FR-3.5** For **COD**, the order is created immediately at placement with no charge. Payment is collected by the courier at delivery; the order is considered paid when it is marked Delivered.
- **FR-3.6** On success (any method), a permanent order number is generated and shown on the confirmation page. The confirmation page also offers the order-status lookup for guests.
- **FR-3.7** An order's items, prices, discounts, and totals are fixed at the moment of purchase. Nothing about a past order can be changed by later catalog edits (FR-9.1).
- **FR-3.8** At the moment an order is placed (for both COD and wallet orders), every item is re-checked against current availability and current price. If any item is out of stock, the customer is told, is not charged, and must adjust before placing the order. If a price changed, the customer sees the current price before placing the order.
- **FR-3.9** The storefront never exposes wallet credentials, full card details, or internal credentials to the customer's browser.

### 4.4 Accounts & authentication

- **FR-4.1** A visitor can sign up and sign in either with an email address and password **or by signing in with Google (Gmail)**, and can sign out. An account is entirely optional for buying.
- **FR-4.2** No email verification is required to place an order. Verification is only relevant to the account itself (see FR-4.4). A customer can place COD, JazzCash, or Easypaisa orders as a guest or as an unverified account.
- **FR-4.3** An account is linked to the phone number and, if provided, the email used at checkout. When a guest places an order and later signs up with the same phone or email, that order appears in their account.
- **FR-4.4** Email verification is required to use password reset, and the reset link works only once and expires. Verification email can be resent. This applies to email/password accounts only — an email that was verified by Google at sign-up (Google login) is already considered verified and does not require a store-sent verification email.
- **FR-4.5** A signed-in customer remains signed in across visits and devices until they sign out. Signing out ends the session on that device. A Google sign-in maintains a store session in the same way; if the Google session expires or is revoked, the customer is asked to sign in with Google again rather than being treated as a different customer.
- **FR-4.6** A customer can store one or more delivery addresses in their address book and pick one at checkout.
- **FR-4.7** Account and admin actions require a valid session. A customer account can never perform an admin action — attempting to reach any admin function while signed in as a customer is rejected and logged (see FR-5.6).

### 4.5 Admin panel & dashboard

- **FR-5.1** The admin panel is a separate area, reachable only when signed in as the admin, and includes a dashboard showing at least: total orders, total revenue, orders pending action, and a list of variants at or below their low-stock threshold. Dashboard numbers reflect the current data when the page is opened.
- **FR-5.2** Products and variants: the admin can create, edit, and archive products and variants — name, description, price, category, images, and per-variant stock. Every change is reflected on the storefront within one minute (FR-1.3). Archiving hides an item from the Shop and blocks new purchases but never alters existing orders.
- **FR-5.3** Orders: the admin can list and filter all orders, open an order's details (items, prices, customer phone, delivery address, payment method, payment status, status history), change the order's status (per the rules in EC-14), approve or reject cancellation requests, mark COD cash as collected, and issue refunds.
- **FR-5.4** Bundles: the admin can create, edit, archive, and reactivate fixed kits — name, image, components with quantities, bundle price, and active dates. See 4.6 for the rules the system enforces.
- **FR-5.5** Notifications to the admin: the admin is pinged (WhatsApp/SMS/email, per their configured preference) the moment a new order is placed and the moment a contact-form message arrives. Contact messages also appear in an admin inbox.
- **FR-5.6** Every admin action requires a valid admin session and is authorized on the server, not just hidden from the interface. Failed attempts to access admin functions are logged.
- **FR-5.7** The store has exactly one admin. No sub-roles or staff accounts are needed.

### 4.6 Bundles (fixed pre-made kits)

- **FR-6.1** A bundle is a single purchasable kit of two or more products, sold at a bundle price lower than the sum of its components' individual prices.
- **FR-6.2** The bundle product page shows the components, the component quantities, the individual total, the bundle price, and the savings. The Home page can feature bundles.
- **FR-6.3** A bundle is added to the cart as one item. Cart, checkout, and the order confirmation all show the bundle, its components, and the savings (FR-2.5).
- **FR-6.4** A bundle is purchasable only while every component variant has enough stock for the requested quantity. Its maximum purchasable quantity equals the lowest available stock among its components. If any component reaches zero stock, the bundle is not purchasable anywhere.
- **FR-6.5** On purchase, each component's stock decreases by its quantity in the bundle. Components remain individually purchasable outside the bundle.
- **FR-6.6** An archived or date-expired bundle can no longer be added to a cart. If it is already in a customer's cart, checkout flags it, explains it is no longer available, and requires it to be removed before the order can be placed.
- **FR-6.7** The admin cannot save a bundle whose price is greater than or equal to the sum of its components' individual prices (no "savings" below zero).

### 4.7 Refunds & returns

- **FR-7.1** Only orders that were actually paid online (JazzCash/Easypaisa) have an automated refund path. A refund returns funds to the customer's original payment method.
- **FR-7.2** Cancelling an unshipped order returns the items to stock. If it was paid online, it is also refunded. COD orders that are cancelled or returned have nothing to refund (no online charge existed).
- **FR-7.3** A returned order (refused at the door, or returned after delivery) returns the items to stock. If it was paid online, it is also refunded. A returned COD order is simply closed.
- **FR-7.4** Refund amounts are limited to what was actually paid for the order. No refund can exceed the charged amount.
- **FR-7.5** COD cash collection: when the admin marks a COD order Delivered, the system records that the cash was collected; a Delivered COD order is considered fully paid.

### 4.8 Notifications (WhatsApp, SMS, email)

- **FR-8.1** Order status notifications to customers are delivered in this channel order of preference: **WhatsApp** when the customer's phone number is on WhatsApp → **SMS** otherwise → **email** as an additional copy whenever the customer provided one.
- **FR-8.2** These notifications are always sent: order placed (on order creation, for every order and every method), shipped (when the admin ships), and delivered. A cancelled, returned, or refunded order also notifies the customer.
- **FR-8.3** Each notification is delivered exactly once per event. A repeated or duplicated event (e.g., the same payment confirmation arriving twice) never produces a second notification (see 4.9).
- **FR-8.4** Account notifications (email verification, password reset) are sent by email to the account's address.
- **FR-8.5** The order-placed notification contains the order number, every item with quantity and price, bundle savings, shipping, the total, and the payment method (including whether it is payable on delivery). The shipped notification contains the items and a delivery expectation message that the admin can set (e.g., "2–4 working days").
- **FR-8.6** A failure to send a notification never corrupts the order or the order flow — the order stands and the notification is retried.
- **FR-8.7** No marketing message is sent without the customer's explicit consent. Notifications are transactional only.
- **FR-8.8** Emails are sent from the store's own domain identity and are deliverable to common email providers without being filed as spam. SMS/WhatsApp messages carry the store's configured sender identity.

### 4.9 Reliability & integrity

- **FR-9.1** Order history is immutable: renaming, repricing, archiving, or deleting a product in admin never changes items, prices, or totals on any existing order (FR-3.7).
- **FR-9.2** Stock never goes negative. When two customers attempt to buy the last unit at the same time, exactly one succeeds; the other is told the item is out of stock.
- **FR-9.3** An out-of-stock variant is not purchasable in any part of the flow: product page, cart, or checkout.
- **FR-9.4** A customer can never cause a wallet payment to be charged twice or a single order to be created twice, regardless of double-clicking, browser back/forward, or duplicate submission of the same payment confirmation.
- **FR-9.5** Any event reported by a wallet provider is verified as genuinely from that provider; unverifiable events are rejected and logged.
- **FR-9.6** An existing order (including a paid one) is never lost or overwritten by a server restart, redeployment, or session expiry.

---

## 5. Edge cases & rules

- **EC-1 — Guest becomes a customer.** An order placed as a guest appears in the account created later with the same phone number or email (FR-4.3).
- **EC-2 — Cross-device cart.** A signed-in customer's cart is identical on all their devices and restored after sign-in (FR-2.2).
- **EC-3 — Price drift.** If an item's price changes between adding and checkout, the customer is shown the current price with a notice and must accept it before placing the order. The amount charged (or collected at the door) always equals the amount shown at the moment the order was placed (FR-2.3, FR-3.8).
- **EC-4 — Stock loss at checkout.** If an item goes out of stock between cart and checkout, the order cannot be placed; the customer is told which item is unavailable and may adjust. Nothing is charged (FR-3.8).
- **EC-5 — Double submit.** Placing the order twice (double click, two tabs) produces exactly one order, one charge (for wallet), and one stock decrement (FR-9.4).
- **EC-6 — Replayed payment event.** A payment-confirmation event delivered twice causes no second notification, no second order, and no second stock decrement (FR-8.3, FR-9.4).
- **EC-7 — Expired session mid-checkout.** If the session expires during checkout, the customer re-authenticates (if they have an account) but the cart and already-entered details are preserved (FR-9.6).
- **EC-8 — Expired bundle in cart.** A bundle that expires or is archived while in a cart is flagged and must be removed before the order can be placed (FR-6.6).
- **EC-9 — Archived product in history.** Archiving or deleting a product never changes past orders; it only blocks new purchases (FR-9.1).
- **EC-10 — Impossible bundle price.** The system refuses to save a bundle priced at or above the sum of its components (FR-6.7).
- **EC-11 — Last-unit race.** Concurrent purchase of the final unit of a variant results in exactly one successful order and no negative stock (FR-9.2).
- **EC-12 — Non-returnable goods.** Products can be marked non-returnable. The product page and checkout show the notice; hygiene products are non-returnable by default unless the admin marks otherwise.
- **EC-13 — Bad input.** Invalid phone numbers, malformed addresses, invalid emails, or malformed contact-form submissions produce clear inline error messages, never a crash or a partial order.
- **EC-14 — Order status rules.** An order is in exactly one state, and may only move along these paths:
  - `Pending` (new) → `Shipped` (admin) — also `Cancelled` (admin, restocks), or `Cancellation requested` (customer)
  - `Cancellation requested` → `Cancelled` (admin approves: restocks; refunds if paid online) — or back to `Pending` (admin rejects)
  - `Shipped` → `Delivered` (admin; COD cash collected here) — or `Returned` (refused at door or sent back: restocks; refunds if paid online)
  - `Delivered` → `Returned` (returned after delivery: restocks; refunds if paid online) — or `Refunded` (admin refunds a delivered online-paid order)
  - Terminal states: `Delivered`, `Cancelled`, `Returned`, `Refunded`. An order cannot be shipped, cancelled, returned, or refunded from a terminal state, and a `Refunded` order is never reshipped.
- **EC-15 — COD has no hidden charges.** The total shown at checkout for a COD order is exactly what the courier collects at the door; nothing extra is added (FR-3.3).
- **EC-16 — Guest lookup security.** Order lookup requires both the exact order number and the exact phone number; a mismatch returns a generic "not found" and never reveals order details, so orders can't be looked up by guesswork.
- **EC-17 — Same email, two sign-in methods.** If a customer signs in with Google using an email that already belongs to an email/password account (or vice versa), the store treats it as the same account: the customer's history, addresses, and cart follow the account regardless of which method they used. A customer is never locked out of an account because they picked the other method. Signing in with Google must never create a second, separate account with the same email.

---

## 6. Out of scope

- Coupon/promo codes and cart-level discounts beyond bundles (bundles are the only discount mechanism).
- Loyalty points, reviews and ratings, wishlists, subscriptions, auto-reorder.
- Marketplace or multi-vendor selling; physical point-of-sale; offline/WhatsApp-ordered checkout (orders are only created through the storefront).
- Multi-language and multi-currency; a full VAT/GST/tax engine (prices are tax-inclusive; no tax is calculated at checkout); FBR-style tax invoicing beyond the order receipt.
- Advanced analytics, BI dashboards, A/B testing, CRM, and marketing campaign automation.
- Native mobile apps.
- Carrier-integrated real-time tracking; shipping is status-based only (shipped/delivered).
- Physical lot/batch and expiry-date tracking of inventory.
- Regulatory compliance tooling beyond ingredient/allergen display and non-returnable notices.
- Staff/sub-admin roles (single admin only).

---

## 7. Acceptance criteria

A build satisfies this spec when all of the following hold:

- **AC-1 — End-to-end guest COD purchase.** On a fresh browser with no account, a visitor can browse → open a product → add to cart → check out choosing **Cash on Delivery** with only a phone number and address → see a confirmation page with an order number → receive an order-placed notification by WhatsApp or SMS → see the order appear (with a ping) in the admin panel. Exactly one order exists and the correct variant stock is decremented. Nothing was charged online.
- **AC-2 — End-to-end wallet purchase.** The same journey with **JazzCash** (and **Easypaisa**) creates the order only after payment confirmation, charges exactly the checkout total, and shows the paid order in the customer's order history.
- **AC-3 — No double charge.** Submitting a wallet payment twice (double click or two tabs) produces one charge and one order. Re-delivering the same payment-confirmation event produces no additional notifications, orders, or stock changes.
- **AC-4 — Price integrity.** Cart total, checkout total, charged amount (or COD amount collected), confirmation page, and notification all match, in PKR with whole-rupee amounts. A customer cannot alter an item's price or an order's total by tampering.
- **AC-5 — Last-unit race.** Two customers buying the final unit of a variant concurrently: exactly one succeeds; the other sees an out-of-stock message; stock never shows below zero.
- **AC-6 — Bundle integrity.** Purchasing a bundle decrements each component by the bundle quantity, shows savings lower than the sum of separate purchases, is limited by the lowest component stock, and is not purchasable when any component is out of stock.
- **AC-7 — Admin changes go live.** A price, stock, or archive change in the admin panel is visible on the storefront within one minute. Archived items vanish from the Shop but remain intact in past orders.
- **AC-8 — Admin-only access.** A customer account cannot open any admin page or perform any admin action; the attempt is rejected and logged. Only the admin can manage the catalog, bundles, orders, cancels, returns, and refunds.
- **AC-9 — Order immutability.** After an order is placed, renaming, repricing, or deleting a product in admin does not change any existing order's items, prices, totals, or notifications.
- **AC-10 — Exactly-once notifications.** For each event (placed, shipped, delivered, cancelled, returned, refunded), the customer receives exactly one notification on the right channel (WhatsApp when on WhatsApp, else SMS, plus email when provided). A duplicated or replayed event never produces a second notification.
- **AC-11 — Cancellation workflow.** A customer requests cancellation of a pending paid order; the admin approves; the items are restocked, the wallet refund is issued, and the customer is notified. A rejected request leaves the order pending and shippable.
- **AC-12 — Return & restock.** A COD order refused at the door is marked returned, its items are restocked, and it closes with nothing refunded. A paid order marked returned restocks and refunds to the original method.
- **AC-13 — Guest order lookup.** A guest who enters the correct order number + phone number sees the order's current status, items, and totals. Any wrong combination shows only a generic "not found".
