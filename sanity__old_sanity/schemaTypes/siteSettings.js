export default {
  name: "siteSettings",
  type: "document",
  title: "Site Settings",
  fields: [
    { name: "brandName", type: "string", title: "Brand Name" },
    {
      name: "navLinks",
      type: "array",
      title: "Navigation Links",
      of: [{ type: "object", fields: [
        { name: "label", type: "string", title: "Label" },
        { name: "href", type: "string", title: "Href (e.g. index.html)" },
      ]}],
    },
    {
      name: "footerLinks",
      type: "array",
      title: "Footer Links",
      of: [{ type: "object", fields: [
        { name: "label", type: "string", title: "Label" },
        { name: "href", type: "string", title: "Href" },
      ]}],
    },
    {
      name: "socials",
      type: "array",
      title: "Social Links",
      of: [{ type: "object", fields: [
        { name: "label", type: "string", title: "Label" },
        { name: "href", type: "url", title: "URL" },
      ]}],
    },
  ],
};
