# Chumon studio

French-first React marketing site for chumon.ca. Run `npm ci`, then `npm run dev`. Run `npm run build` to generate static HTML for Netlify in `dist/`. Standard links and language navigation work without JavaScript. Optional Google Analytics uses the existing VITE_GA_MEASUREMENT_ID setting.

Bilingual routes and metadata live in src/pages.json. The renderer supplies canonical and alternate links, structured data and the sitemap. Update the sitemap modification date when changing page content. The blog awaits the original French Markdown and its publication metadata.

After deployment, verify the response status and content type of the sitemap, robots file, both language routes and an unknown URL. Félix can then submit https://chumon.ca/sitemap.xml in Google Search Console and complete the Montreal studio's Google Business Profile.

