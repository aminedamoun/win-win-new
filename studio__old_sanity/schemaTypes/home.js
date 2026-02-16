export default {
  name: "home",
  type: "document",
  title: "Homepage",
  fields: [
    {
      name: "hero",
      type: "object",
      title: "Hero",
      fields: [
        { name: "kicker", type: "localeString", title: "Kicker" },
        { name: "title", type: "localeString", title: "Title (base)" },
        { name: "titleEmphasis", type: "localeString", title: "Title (emphasis)" },
        { name: "subtitle", type: "localeText", title: "Subtitle" },
        {
          name: "primaryCta",
          type: "object",
          title: "Primary CTA",
          fields: [
            { name: "label", type: "localeString" },
            { name: "href", type: "string" },
          ],
        },
        {
          name: "secondaryCta",
          type: "object",
          title: "Secondary CTA",
          fields: [
            { name: "label", type: "localeString" },
            { name: "href", type: "string" },
          ],
        },
        { name: "heroImage", type: "image", title: "Hero Image" },
      ],
    },

    {
      name: "stats",
      type: "array",
      title: "Stats",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "localeString" },
            { name: "value", type: "string" },
          ],
        },
      ],
    },

    {
      name: "services",
      type: "array",
      title: "Services",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "localeString" },
            { name: "description", type: "localeText" },
          ],
        },
      ],
    },

    {
      name: "benefits",
      type: "array",
      title: "Benefits",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "localeString" },
            { name: "description", type: "localeText" },
          ],
        },
      ],
    },

    {
      name: "processSteps",
      type: "array",
      title: "Process Steps",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "localeString" },
            { name: "description", type: "localeText" },
          ],
        },
      ],
    },

    {
      name: "faq",
      type: "array",
      title: "FAQ",
      of: [
        {
          type: "object",
          fields: [
            { name: "q", type: "localeString" },
            { name: "a", type: "localeText" },
          ],
        },
      ],
    },

    { name: "seoText", type: "localeText", title: "SEO Paragraph" },
  ],
};
