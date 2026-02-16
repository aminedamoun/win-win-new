import "dotenv/config";
import { createClient } from "@sanity/client";
import { HOME_EN, HOME_SL } from "../content/homeContent.js";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "92q50lc5",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

/**
 * IMPORTANT:
 * Your schema likely uses custom types: localeString / localeText.
 * Add `_type` so Sanity Studio renders the inputs correctly (no [object Object]).
 */
function locString(en, sl) {
  return { _type: "localeString", en: en ?? "", sl: sl ?? "" };
}

function locText(en, sl) {
  return { _type: "localeText", en: en ?? "", sl: sl ?? "" };
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("Missing SANITY_API_TOKEN in studio/.env");
  }

  // Helper: safely read paths that might not exist in one language
  const pick = (v, fallback = "") => (v === undefined || v === null ? fallback : v);

  // ---- HERO key mapping (supports both {titleBase,titleEmphasis,...} and {title,subtitle,...}) ----
  const enHero = HOME_EN?.hero || {};
  const slHero = HOME_SL?.hero || {};

  const enHeroTitleBase = pick(enHero.titleBase, pick(enHero.title, ""));
  const slHeroTitleBase = pick(slHero.titleBase, pick(slHero.title, ""));

  const enHeroTitleEmphasis = pick(enHero.titleEmphasis, "");
  const slHeroTitleEmphasis = pick(slHero.titleEmphasis, "");

  // If your schema field is called "subtitle" but content uses "description", support both
  const enHeroSubtitle = pick(enHero.subtitle, pick(enHero.description, ""));
  const slHeroSubtitle = pick(slHero.subtitle, pick(slHero.description, ""));

  const enPrimary = enHero.primaryCta || {};
  const slPrimary = slHero.primaryCta || {};
  const enSecondary = enHero.secondaryCta || {};
  const slSecondary = slHero.secondaryCta || {};

  // ---- ABOUT stats mapping (supports either about.stats[] OR about.values + about.stats labels) ----
  const enAbout = HOME_EN?.about || {};
  const slAbout = HOME_SL?.about || {};

  const statsFromArray =
    Array.isArray(enAbout.stats) && enAbout.stats.length
      ? enAbout.stats.map((enStat, i) => {
          const slStat = (slAbout.stats || [])[i] || {};
          // support stat as object {value,label} OR as primitive value
          const value = typeof enStat === "object" ? enStat.value : enStat;
          const enLabel = typeof enStat === "object" ? enStat.label : "";
          const slLabel = typeof slStat === "object" ? slStat.label : "";
          return {
            value: String(value ?? ""),
            label: locString(enLabel ?? "", slLabel ?? ""),
          };
        })
      : [];

  const statsFromValues =
    enAbout.values && enAbout.stats
      ? [
          {
            value: String(enAbout.values.deals ?? ""),
            label: locString(enAbout.stats.deals ?? "", slAbout.stats?.deals ?? ""),
          },
          {
            value: String(enAbout.values.locations ?? ""),
            label: locString(enAbout.stats.locations ?? "", slAbout.stats?.locations ?? ""),
          },
          {
            value: String(enAbout.values.team ?? ""),
            label: locString(enAbout.stats.team ?? "", slAbout.stats?.team ?? ""),
          },
          {
            value: String(enAbout.values.years ?? ""),
            label: locString(enAbout.stats.experience ?? "", slAbout.stats?.experience ?? ""),
          },
        ]
      : [];

  const aboutStats = statsFromArray.length ? statsFromArray : statsFromValues;

  // ---- SERVICES mapping supports both block1/block2/block3 and blocks.{core/support/market} ----
  const enServices = HOME_EN?.services || {};
  const slServices = HOME_SL?.services || {};

  const enBlocks = enServices.blocks || {};
  const slBlocks = slServices.blocks || {};

  const doc = {
    _id: "home.singleton",
    _type: "home",

    hero: {
      title: locString(enHeroTitleBase, slHeroTitleBase),
      titleEmphasis: locString(enHeroTitleEmphasis, slHeroTitleEmphasis),
      subtitle: locText(enHeroSubtitle, slHeroSubtitle),

      primaryCta: {
        label: locString(pick(enPrimary.label, ""), pick(slPrimary.label, "")),
        href: pick(enPrimary.href, pick(slPrimary.href, "/apply.html")),
      },
      secondaryCta: {
        label: locString(pick(enSecondary.label, ""), pick(slSecondary.label, "")),
        href: pick(enSecondary.href, pick(slSecondary.href, "/jobs.html")),
      },
      heroImage: null, // upload later if you want
    },

    about: {
      title: locString(pick(enAbout.title, ""), pick(slAbout.title, "")),
      description: locText(pick(enAbout.description, ""), pick(slAbout.description, "")),
      image: null,
      // IMPORTANT: do NOT force `_type: "object"` here; let schema decide.
      stats: aboutStats,
    },

    services: {
      title: locString(pick(enServices.title, ""), pick(slServices.title, "")),
      description: locText(pick(enServices.description, ""), pick(slServices.description, "")),

      // support both naming styles
      block1: locString(pick(enServices.block1, pick(enBlocks.core, "")), pick(slServices.block1, pick(slBlocks.core, ""))),
      block2: locString(
        pick(enServices.block2, pick(enBlocks.support, "")),
        pick(slServices.block2, pick(slBlocks.support, ""))
      ),
      block3: locString(pick(enServices.block3, pick(enBlocks.market, "")), pick(slServices.block3, pick(slBlocks.market, ""))),

      core: (enServices.core || []).map((x, i) => {
        const y = (slServices.core || [])[i] || {};
        return {
          title: locString(pick(x?.title, ""), pick(y?.title, "")),
          description: locText(pick(x?.description, ""), pick(y?.description, "")),
        };
      }),
      support: (enServices.support || []).map((x, i) => {
        const y = (slServices.support || [])[i] || {};
        return {
          title: locString(pick(x?.title, ""), pick(y?.title, "")),
          description: locText(pick(x?.description, ""), pick(y?.description, "")),
        };
      }),
      market: (enServices.market || []).map((x, i) => {
        const y = (slServices.market || [])[i] || {};
        return {
          title: locString(pick(x?.title, ""), pick(y?.title, "")),
          description: locText(pick(x?.description, ""), pick(y?.description, "")),
        };
      }),
    },

    benefits: {
      title: locString(pick(HOME_EN?.benefits?.title, ""), pick(HOME_SL?.benefits?.title, "")),
      description: locText(pick(HOME_EN?.benefits?.description, ""), pick(HOME_SL?.benefits?.description, "")),
      items: (HOME_EN?.benefits?.items || []).map((x, i) => {
        const y = (HOME_SL?.benefits?.items || [])[i] || {};
        return {
          title: locString(pick(x?.title, ""), pick(y?.title, "")),
          description: locText(pick(x?.description, ""), pick(y?.description, "")),
        };
      }),
    },

    join: {
      title: locString(pick(HOME_EN?.join?.title, ""), pick(HOME_SL?.join?.title, "")),
      description: locText(pick(HOME_EN?.join?.description, ""), pick(HOME_SL?.join?.description, "")),
      btn1: locString(pick(HOME_EN?.join?.btn1, ""), pick(HOME_SL?.join?.btn1, "")),
      btn2: locString(pick(HOME_EN?.join?.btn2, ""), pick(HOME_SL?.join?.btn2, "")),
      image: null,
    },

    cta: {
      title: locString(pick(HOME_EN?.cta?.title, ""), pick(HOME_SL?.cta?.title, "")),
      description: locText(pick(HOME_EN?.cta?.description, ""), pick(HOME_SL?.cta?.description, "")),
      btn1: locString(pick(HOME_EN?.cta?.btn1, ""), pick(HOME_SL?.cta?.btn1, "")),
      btn2: locString(pick(HOME_EN?.cta?.btn2, ""), pick(HOME_SL?.cta?.btn2, "")),
      image: null,
    },

    process: {
      title: locString(pick(HOME_EN?.process?.title, ""), pick(HOME_SL?.process?.title, "")),
      description: locText(pick(HOME_EN?.process?.description, ""), pick(HOME_SL?.process?.description, "")),
      button: locString(pick(HOME_EN?.process?.button, ""), pick(HOME_SL?.process?.button, "")),
      steps: (HOME_EN?.process?.steps || []).map((x, i) => {
        const y = (HOME_SL?.process?.steps || [])[i] || {};
        return {
          step: pick(x?.step, ""),
          title: locString(pick(x?.title, ""), pick(y?.title, "")),
          description: locText(pick(x?.description ?? x?.desc, ""), pick(y?.description ?? y?.desc, "")),
        };
      }),
    },

    faq: {
      // support both plain title and titleHtml (we store plain text)
      title: locString(
        pick(HOME_EN?.faq?.title, pick(HOME_EN?.faq?.titleHtml, "")),
        pick(HOME_SL?.faq?.title, pick(HOME_SL?.faq?.titleHtml, ""))
      ),
      description: locText(pick(HOME_EN?.faq?.description, ""), pick(HOME_SL?.faq?.description, "")),
      still: locString(pick(HOME_EN?.faq?.still, ""), pick(HOME_SL?.faq?.still, "")),
      button: locString(pick(HOME_EN?.faq?.button, ""), pick(HOME_SL?.faq?.button, "")),
      items: (HOME_EN?.faq?.items || []).map((x, i) => {
        const y = (HOME_SL?.faq?.items || [])[i] || {};
        return {
          q: locString(pick(x?.q, ""), pick(y?.q, "")),
          a: locText(pick(x?.a, ""), pick(y?.a, "")),
        };
      }),
    },

    seo: {
      summaryTitle: locString(pick(HOME_EN?.seo?.summaryTitle, ""), pick(HOME_SL?.seo?.summaryTitle, "")),
      html: locText(pick(HOME_EN?.seo?.html, ""), pick(HOME_SL?.seo?.html, "")),
    },
  };

  const res = await client.createOrReplace(doc);
  console.log("✅ Upserted home:", res._id);
}

main().catch((e) => {
  console.error("❌ Import failed:", e);
  process.exit(1);
});
