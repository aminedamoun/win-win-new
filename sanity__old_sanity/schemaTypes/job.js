export default {
  name: "job",
  type: "document",
  title: "Job",
  fields: [
    { name: "active", type: "boolean", title: "Active", initialValue: true },
    { name: "displayOrder", type: "number", title: "Display Order", initialValue: 0 },
    { name: "title", type: "string", title: "Title" },
    { name: "location", type: "string", title: "Location" },
    { name: "jobType", type: "string", title: "Type (e.g. Full-time)" },
    { name: "shortDescription", type: "text", title: "Short Description" },
    { name: "salaryRange", type: "string", title: "Salary Range" },
    { name: "bodyHtml", type: "text", title: "Body HTML" },
    { name: "requirements", type: "array", title: "Requirements", of: [{ type: "string" }] },
    { name: "responsibilities", type: "array", title: "Responsibilities", of: [{ type: "string" }] },
    { name: "benefits", type: "array", title: "Benefits", of: [{ type: "string" }] },
  ],
};
