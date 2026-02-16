import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2025-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Site root is one level up from /studio
const SITE_ROOT = path.resolve(__dirname, "..", "..");

const ABOUT_EN = path.join(SITE_ROOT, "about.html");
const ABOUT_SL = path.join(SITE_ROOT, "about-sl.html");

function textById($, id) {
  const el = $(`#${id}`);
  return el.length ? el.text().trim() : "";
}

function htmlById($, id) {
  const el = $(`#${id}`);
  return el.length ? (el.html() ?? "").trim() : "";
}

async function loadHtml(filePath) {
  const html = await fs.readFile(filePath, "utf8");
  return cheerio.load(html);
}

async function upsertAbout(doc) {
  const _id = "about.singleton";
  return client.createOrReplace({ _id, ...doc });
}

async function main() {
  const $en = await loadHtml(ABOUT_EN);
  const $sl = await loadHtml(ABOUT_SL);

  // IMPORTANT:
  // These IDs MUST exist in about.html/about-sl.html.
  // If any are different, paste your about.html section IDs and I’ll adjust.
  const doc = {
    _type: "aboutPage",

    heroTitle: { en: textById($en, "aboutHeroTitle"), sl: textById($sl, "aboutHeroTitle") },
    heroDesc: { en: textById($en, "aboutHeroDesc"), sl: textById($sl, "aboutHeroDesc") },

    vmHtml: { en: htmlById($en, "aboutVM"), sl: htmlById($sl, "aboutVM") },

    valuesTitle: { en: textById($en, "aboutValuesTitle"), sl: textById($sl, "aboutValuesTitle") },
    valuesDesc: { en: textById($en, "aboutValuesDesc"), sl: textById($sl, "aboutValuesDesc") },

    cultureTitle: { en: textById($en, "aboutCultureTitle"), sl: textById($sl, "aboutCultureTitle") },
    cultureDesc: { en: textById($en, "aboutCultureDesc"), sl: textById($sl, "aboutCultureDesc") },

    teamTitle: { en: textById($en, "aboutTeamTitle"), sl: textById($sl, "aboutTeamTitle") },
    teamDesc: { en: textById($en, "aboutTeamDesc"), sl: textById($sl, "aboutTeamDesc") },

    faqTitle: { en: textById($en, "faqTitle"), sl: textById($sl, "faqTitle") },
    faqDesc: { en: textById($en, "faqDesc"), sl: textById($sl, "faqDesc") },

    seoSummaryTitle: { en: textById($en, "seoSummaryTitle"), sl: textById($sl, "seoSummaryTitle") },
    seoHtml: { en: htmlById($en, "seoHtml"), sl: htmlById($sl, "seoHtml") },
  };

  const res = await upsertAbout(doc);
  console.log("✅ Upserted about:", res._id);
}

main().catch((err) => {
  console.error("❌ Import failed:", err);
  process.exit(1);
});
