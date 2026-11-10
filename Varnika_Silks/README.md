# Varnika Silks — Premium Heritage Saree Showroom (Demo Template)

A fully local, multipage HTML/CSS/JavaScript storefront demonstration for a premium traditional Indian saree showroom. It does not require React, an API key, paid libraries, or a dashboard.

## Launch

1. Unzip the package.
2. Open the folder `Varnika_Silks_Premium_Website` in VS Code.
3. Run **Live Server** on `index.html`, or double-click `index.html` to open locally.
4. For a local server alternative, run `python -m http.server 8000` inside the folder and visit `http://localhost:8000`.

All images, styling and scripts are bundled locally. No external fonts, icon libraries or image links are required.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home 1 — general heritage saree showroom |
| `home2.html` | Home 2 — dedicated Bridal & Muhurtham experience |
| `collections.html` | Searchable catalogue with fabric and occasion filters, price sorting |
| `saree-details.html?id=vs-101` | Product-specific details, care and enquiry |
| `bridal-sarees.html` | Bridal-focused saree selection |
| `about.html` | Brand story and exactly three illustrative leadership profiles |
| `blog.html` | Eight original guides, category filters and search |
| `blog-details.html?article=silk-care` | Corresponding full article (dynamic based on query parameter) |
| `contact.html` | Validated demo enquiry / showroom-visit form |
| `privacy.html` | Demo privacy information |
| `terms.html` | Demo terms / disclaimer |
| `404.html` | Page-not-found experience |

## Key interactions

- **Light/Dark** and **RTL/LTR** are available in the header and mobile menu, and store preferences in browser localStorage where permitted.
- **Home dropdown** links to both distinct homepages.
- **Collections**: fabric, occasion, search, sorting and Reset filters. Search and filters combine.
- **28 unique catalogue records**, with at least four entries in each of the six fabric and six occasion categories.
- **Product details**: each product has a distinct `id` and corresponding details page URL; enquiry links include the selected product.
- **Bridal catalogue**: searches and colour-themed entry links.
- **Blog**: eight guides with correct `article` routes, functional search and category filtering.
- **Contact**: validates full name, Indian phone digits, email, type, visit date and message; saves demo requests locally only.
- **Newsletter**: demo preview saves the entered email to localStorage only.
- Forms and toggles use an in-site status or toast rather than browser `alert()`.

## Design colours

Light: ivory `#FFF8EE`, cream `#F3E5D3`, maroon `#560B19`, gold `#C99952`.
Dark: wine-black `#1B0B10`, burgundy `#270E17`, champagne `#FFF2DC`, gold `#E7C891`.

## Demo content: important before publication

The **brand is used as a design demonstration**. No verified store address, phone, hours, inventory, staff identities or certifications were provided. Product images, prices, descriptive material details, names and the three team profiles are illustrative, not real verified merchandise or employees. All local images are generated assets/design illustrations; they are not photographs of an actual Varnika Silks showroom.

The forms **do not send email, WhatsApp messages or bookings to a real business**. Requests may be stored in the visitor's own browser for demo purposes. There is **no cart, checkout, payment or purchasing functionality** (as requested).

For a live business: replace sample product data in `assets/js/data.js`, provide approved business details and imagery, configure a backend for forms, create live terms/privacy text, and add a verified address/map and official social links only after confirmation.

## File structure

- `assets/css/style.css` — unified responsive design system and dark mode
- `assets/js/data.js` — 28 sample sarees, eight article guides, three team profiles
- `assets/js/app.js` — navigation, filtering, rendering, modal-free enquiry workflow, theme/RTL
- `assets/images/` — local optimized WebP imagery and image inventory
- `assets/icons/favicon.svg` — matching lotus icon
- `QA_REPORT.md` — verification summary

## Image integrity

Each different catalogue product uses its own unique local image path. A product may appear again on a matching featured or detail view because the same product needs consistent identity. Blog stories use their own article imagery. Three team portraits are distinct and labelled as illustrative profiles.

## Browser notes

`file://` generally works because the website uses local scripts and inline icons, but **Live Server** is recommended for editing and a reliable test environment. Mobile menu controls contain the theme/direction tools below 992px; 1024px and above retain full desktop navigation.


## November 2026 — Premium Navbar / Mobile Light Mode Refinement

- At mobile/tablet widths, Light Mode navigation opens on a warm ivory panel with dark readable maroon links, a clear current-page marker, and a gold-accented control area. Dark Mode opens on matching deep burgundy with light text.
- The desktop navbar now includes an **Explore Silks** CTA that links directly to `collections.html`; the mobile menu offers an **Explore the Collections** CTA.
- Mobile theme and text-direction controls are labelled clearly, support inline SVG icons and update when toggled. The hamburger changes into a close icon when the menu opens.
- The previous pages, catalogue and article functionality are preserved.

To preview, extract the ZIP and open `index.html` or use VS Code Live Server. The bundled images and SVG icons are local.

## November 2026 client QA fixes
- Footer social icons appear across all standard pages; buttons link to platform websites, not unverified brand accounts.
- Replaced off-topic catalogue images (birds, city views, western clothing) with distinct saree-focused editorial or fabric imagery; all 28 existing product IDs/routes stay unchanged.
- Added six bridal edit tiles to Home 2 and expanded cotton/festive guidance in Collections.
- Expanded the Journal to eight articles with more detailed sections, plus a new editorial discovery section.
- Adjusted 768px hero presentation and tablet blog columns, and added breathing room between bridal CTA text/buttons.
- Product photographs and descriptions are illustrative/demo data; business must verify exact material composition and stock before launch.
