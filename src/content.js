import staticPages from "./pages.json";

// Each entry contains one published language edition of an article.
// Group translations with the same id. Drafts have no publication date.
export const blogEnabled = false;
export const articles = []
  .filter(
    (article) =>
      blogEnabled &&
      article.published &&
      Date.parse(article.published) <= Date.now(),
  )
  .sort((a, b) => b.published.localeCompare(a.published));

export const pages = { ...staticPages };
if (!blogEnabled) delete pages.blog;
for (const article of articles) {
  const key = "post-" + article.id;
  pages[key] ??= {};
  pages[key][article.lang] = {
    ...article,
    label: article.title,
    description: article.excerpt,
    path: (article.lang === "en" ? "/en" : "") + "/blog/" + article.slug,
  };
}

export const navigation = [
  ["realisations", "Réalisations", "Work"],
  ["approche", "Approche", "Approach"],
  ["a-propos", "À propos", "About"],
  ["contact", "Contact", "Contact"],
];

export function publishedNotes(lang) {
  const ids = [...new Set(articles.map((article) => article.id))];
  return ids
    .map((id) => pages["post-" + id][lang] ?? pages["post-" + id].fr)
    .filter(Boolean)
    .sort((a, b) => b.published.localeCompare(a.published));
}
