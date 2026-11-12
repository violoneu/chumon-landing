# Chumon studio

Run `npm ci`, `npm run dev`, or use `npm run build` and `npm run preview` to review Netlify’s static output. The French and English homepages share four section IDs. Former standalone page URLs redirect permanently to the matching section.

Replace public/img/hero.webp and public/img/felix.webp with the final images. Replace the marked bilingual project and founder copy in src/App.jsx. The blog is temporarily disabled. Set blogEnabled in src/content.js to true to restore its routes and navigation. Populate the articles collection in src/content.js with id, lang, slug, title, excerpt, published (ISO date), author and paragraphs. Translations share an id. Rebuild to publish. The home shows up to three published entries.

VITE_CONTACT_ENDPOINT overrides the default Netlify function /.netlify/functions/send-email. The form sends JSON (name, email, company, message, hp). Configure RESEND_API_KEY, FROM_EMAIL and TO_EMAIL in Netlify for mail delivery. Run Netlify Dev to exercise the function locally. VITE_ORGANIZATION_SAME_AS accepts comma-separated HTTPS URLs for verified public studio profiles. Client VITE variables are public. Keep the mail API key server-side.

After deployment, check the redirects, form delivery, robots.txt, sitemap.xml, og.png and a missing URL. Submit the sitemap to Search Console and complete the studio’s Google Business Profile.
