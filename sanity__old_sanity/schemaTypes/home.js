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
        { name: "title", title: "Title (base)", type: "localeString" },
        { name: "titleEmphasis", title: "Title (emphasis)", type: "localeString" },
        { name: "subtitle", title: "Subtitle", type: "localeText" },
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
      name: "about",
      type: "object",
      title: "Who we are",
      fields: [
        { name: "title", type: "localeString" },
        { name: "description", type: "localeText" },
        { name: "image", type: "image", title: "Image" },
        {
          name: "stats",
          type: "array",
          title: "Stats",
          of: [
            {
              type: "object",
              fields: [
                { name: "value", type: "string" },
                { name: "label", type: "localeString" },
              ],
            },
          ],
        },
      ],
    },

    {
      name: "services",
      type: "object",
      title: "Services",
      fields: [
        { name: "title", type: "localeString" },
        { name: "description", type: "localeText" },
        { name: "block1", type: "localeString" },
        { name: "block2", type: "localeString" },
        { name: "block3", type: "localeString" },

        { name: "core", type: "array", of: [{ type: "object", fields: [{ name: "title", type: "localeString" }, { name: "description", type: "localeText" }] }] },
        { name: "support", type: "array", of: [{ type: "object", fields: [{ name: "title", type: "localeString" }, { name: "description", type: "localeText" }] }] },
        { name: "market", type: "array", of: [{ type: "object", fields: [{ name: "title", type: "localeString" }, { name: "description", type: "localeText" }] }] },
      ],
    },

    {
      name: "benefits",
      type: "object",
      title: "Benefits",
      fields: [
        { name: "title", type: "localeString" },
        { name: "description", type: "localeText" },
        {
          name: "items",
          type: "array",
          of: [
            {
              type: "object",
              fields: [{ name: "title", type: "localeString" }, { name: "description", type: "localeText" }],
            },
          ],
        },
      ],
    },

    {
      name: "join",
      type: "object",
      title: "Join section",
      fields: [
        { name: "title", type: "localeString" },
        { name: "description", type: "localeText" },
        { name: "image", type: "image" },
        { name: "btn1", type: "localeString" },
        { name: "btn2", type: "localeString" },
      ],
    },

    {
      name: "cta",
      type: "object",
      title: "CTA section",
      fields: [
        { name: "title", type: "localeString" },
        { name: "description", type: "localeText" },
        { name: "image", type: "image" },
        { name: "btn1", type: "localeString" },
        { name: "btn2", type: "localeString" },
      ],
    },

    {
      name: "process",
      type: "object",
      title: "Process",
      fields: [
        { name: "title", type: "localeString" },
        { name: "description", type: "localeText" },
        { name: "button", type: "localeString" },
        {
          name: "steps",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "step", type: "string" },
                { name: "title", type: "localeString" },
                { name: "description", type: "localeText" },
              ],
            },
          ],
        },
      ],
    },

    {
      name: "faq",
      type: "object",
      title: "FAQ",
      fields: [
        { name: "title", type: "localeString" },
        { name: "description", type: "localeText" },
        { name: "still", type: "localeString" },
        { name: "button", type: "localeString" },
        {
          name: "items",
          type: "array",
          of: [
            {
              type: "object",
              fields: [{ name: "q", type: "localeString" }, { name: "a", type: "localeText" }],
            },
          ],
        },
      ],
    },

    {
      name: "seo",
      type: "object",
      title: "SEO accordion",
      fields: [
        { name: "summaryTitle", type: "localeString" },
        { name: "html", type: "localeText" },
      ],
    },
  ],
};
