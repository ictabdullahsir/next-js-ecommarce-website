# LOOM store with full CMS admin

## Run
```bash
pnpm install          # or npm install
cp .env.example .env.local   # set MONGODB_URI and ADMIN_PASSWORD
pnpm dev
```
- Store: http://localhost:3000
- Admin: http://localhost:3000/admin (password from `ADMIN_PASSWORD`)

The first page load creates the database and fills it from `lib/seed-data.ts`.

## What the admin controls
| Area | You can |
|---|---|
| Dashboard | Revenue, orders, awaiting action, low stock, best sellers |
| Orders | Filter by status, update status, add internal notes, delete. Cancelling restores stock |
| Products | Create, edit, delete, publish/unpublish, price, sale price, sizes, colors, stock |
| Categories | Add, edit, delete (blocked while products use it) |
| Customers | Built from orders, ranked by spend |
| Coupons | Percent or fixed, minimum spend, usage limit, expiry |
| Site Content | Announcement bar, hero, headings, perks, footer tagline |
| Pages | Create content pages at `/pages/your-slug` |
| Navigation | Header links and up to 3 footer columns |
| Media | Upload and delete images (saved to `public/uploads`) |
| Settings | Store name, contact, social links, shipping fee, free-shipping threshold |

## Storefront
Checkout now saves a real order (cash on delivery): prices, stock and coupons are checked on the server.

## Notes
- Data lives in MongoDB: collection `store` (catalog and content) and `orders`.
- Image uploads need a writable disk (VPS, Docker, local). On Vercel, paste external image URLs instead.
- Prices are in USD. Online payments and multiple admin accounts are not included.
