export default {
  name: "article",
  type: "document",
  title: "Article",
  fields: [
    { name: "published", type: "boolean", title: "Published", initialValue: false },
    { name: "featured", type: "boolean", title: "Featured", initialValue: false },
    { name: "title", type: "string", title: "Title" },
    { name: "slug", type: "slug", title: "Slug", options: { source: "title" } },
    { name: "category", type: "string", title: "Category" },
    { name: "excerpt", type: "text", title: "Excerpt" },
    { name: "authorName", type: "string", title: "Author Name" },
    { name: "publishedAt", type: "datetime", title: "Published At" },
    { name: "readTimeMinutes", type: "number", title: "Read Time (min)" },
    { name: "contentHtml", type: "text", title: "Content HTML" },
  ],
};
