PROJECT: win-win-new
Pure HTML website (EN + SL) with Sanity CMS (content) + optional Supabase (apply form).
- No framework
- No /pages folder
- All pages are visible in root
- EN and SL are separate files (no translation layer)

FILES
- Root: HTML pages
- /assets/css: styles
- /assets/js: logic
- /sanity/schemaTypes: Sanity schemas

SETUP
1) Edit assets/js/config.js with your Sanity projectId/dataset (and optional token).
2) (Optional) Enable Supabase in config.js for resume upload + applications.
