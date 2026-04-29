# Abhinav Raj Portfolio - Final Rebuild

This folder is the editable rebuild of the portfolio. It keeps the editorial newspaper language from the reference website and videos, but avoids Webflow-generated class bloat.

## Edit Map

- `data.js` - edit projects, notes, social links, email, and profile text.
- `index.html` - home page with the main masthead and short-poster selected work rail.
- `work.html` - detailed work page using `assets/projects/detailed/`.
- `about.html` - profile page with the newspaper-cutting avatar and builder notes.
- `contact.html` - contact columns, social links, and a Resend-ready contact form surface.
- `styles.css` - design tokens, layout, typography, and animation system.
- `app.js` - rendering and interactions: menu curtain, draggable work rail, reveal animation, clock, marquee, contact mail draft, and cursor.
- `assets/` - local fonts, project posters, logos, portrait, transparent logo, and stamp.

## Reference Translation

- Original `www.niccolomiranda.com`: paper masthead, horizontal work system, black menu curtain, marquee footer, paper texture.
- `New`: Abhinav copy, local fonts, project artwork, logos, contact links, research links, and live project links.
- Videos: opening dark stage, rotating paper entrance, torn-paper transition, sideways work navigation, and black full-screen menu.
- AI clone: only used for broad newspaper rebuild intent; the final code avoids its brittle inline styling and external placeholder imagery.

Run from this folder with `python3 -m http.server 5173 --bind 127.0.0.1`, then open `http://127.0.0.1:5173/`. No build step is required.
