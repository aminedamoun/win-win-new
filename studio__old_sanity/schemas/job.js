export default {
  name: "job",
  title: "Job",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "localeString" },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    { name: "location", title: "Location", type: "localeString" },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: { list: ["Full-time", "Part-time", "Contract", "Internship"] },
    },
    { name: "salary", title: "Salary", type: "localeString" },
    { name: "intro", title: "Intro", type: "localeString" },

    { name: "active", title: "Active", type: "boolean", initialValue: true },
    { name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 },
  ],
};
