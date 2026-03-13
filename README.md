# Weblegs Collections Colors — App Overview

## What Does This App Do?

**Weblegs Collections Colors** is a Shopify embedded app that lets merchants assign colour schemes to product categories. The colours saved in this app are served to the storefront via a public API so the theme can apply the correct colours to each collection page automatically.

### Core Workflow
1. Merchant opens the app inside Shopify Admin
2. Merchant adds a category name and sets its Primary, Font, and Header colours
3. The colours are saved to the database
4. The storefront theme fetches the colours from the app's public API and applies them to the matching collection pages

---

## App Pages

### 1. Collections Colors (Main Page)
- Table of all saved category colour configurations
- Each row shows the category name, Primary colour, Font colour, and Header colour with a colour swatch preview
- "Add Color" button to open the entry form
- Edit and Delete actions per row

### 2. Add / Edit Form
- Category Name field
- Primary Color field (hex code, e.g. `#FF0000`)
- Font Color field
- Header Color field
- Save / Update / Cancel buttons

---

## Public API Endpoints

These endpoints are called by the Shopify theme — no authentication required.

| Endpoint | What It Returns |
|---------|----------------|
| `GET /api/category-colors` | All category colour configurations as JSON |
| `GET /api/brand-counts` | All brand names and their product counts as JSON |
| `POST /api/sync/brand-counts` | Syncs brand counts from Shopify products (protected by `SYNC_SECRET` header) |

---

## Tech Stack (For Developers)

| Component | Technology |
|----------|-----------|
| Framework | React Router v7 (Node.js) |
| Shopify Integration | Shopify Admin GraphQL API |
| Database | PostgreSQL (hosted on Railway) |
| ORM | Prisma |
| UI | Shopify Polaris Web Components |
| Build Tool | Vite |

---

## Database Tables

| Table | What It Stores |
|-------|---------------|
| Session | Shopify OAuth tokens |
| CategoryDetail | Category name + Primary, Font, and Header colour hex codes |
| BrandCount | Brand (vendor) names and their product counts |
| CompleteKit | Collection-to-product mappings for complete kit bundles |

---

## Key Files (For Developers)

```
app/
├── routes/
│   ├── app._index.jsx              — Main page: colour table, add/edit/delete form
│   ├── app.jsx                     — App shell with nav
│   ├── api.category-colors.jsx     — Public API: returns all category colours
│   ├── api.brand-counts.jsx        — Public API: returns all brand counts
│   ├── api.sync.brand-counts.jsx   — Protected API: syncs brand counts from Shopify
│   ├── auth.$.jsx                  — Shopify OAuth handler
│   └── webhooks.*                  — Webhook handlers (uninstall, scopes update)
├── shopify.server.js               — Shopify app config and auth helpers
└── db.server.js                    — Prisma client
prisma/
└── schema.prisma                   — Database schema
```

---

## Shopify Permissions Required

| Permission | Reason |
|-----------|--------|
| `write_products` | Required to access product and vendor data for brand count sync |

---

## Hosting & Deployment

- **App URL:** `https://diligent-laughter-production.up.railway.app`
- **Database:** PostgreSQL on Railway
- **Deploy:** Push to `main` branch on GitHub → Railway auto-deploys
- **Store:** `wljadlamracing.myshopify.com`
