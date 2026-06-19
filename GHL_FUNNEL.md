# Win-Win Recruitment Funnel — Implementation Status & Handover

**Project:** Win-Win careers funnel (Meta → Careers page → Online application → Interview booking)
**Site:** https://www.win-win.si
**Last updated:** 2026-06-19

---

## 1. The funnel logic (as specified)

```
Meta Lead → Careers Page (/zaposlitve/) → Online Application Form (/prijava/)
          → Interview Booking (/booking/) → Interview Attendance → Selection Decision
```

Core rules:
- A Meta lead is **never** sent straight to the application form. The first CTA always points to **`/zaposlitve/`**.
- The booking link is sent **only after** the online application form is submitted.
- All candidate messaging uses **classic SMS** (not WhatsApp).
- Every reminder sequence **stops automatically** as soon as the candidate completes the next step.

There are **two systems** involved:

| System | Owner | Role |
|---|---|---|
| **Website** (this codebase) | Web team (us) | Careers page, application form, booking page, data capture, conversion pixel |
| **GoHighLevel (CRM)** | CRM expert | Meta lead intake, tags, SMS/email sequences, reminders, pipeline, calendar automations |

The website **feeds data into** GoHighLevel. The automation, reminders, tags and pipeline **live inside GoHighLevel** and must be configured there.

---

## 2. ✅ What is already in place (website)

| Requirement | Status | Location |
|---|---|---|
| Careers page `/zaposlitve/` (first CTA target) | ✅ Live | jobs loaded from Contentful |
| Candidate picks a role → goes to form with that role attached | ✅ Live | each job links `/prijava/?job=<slug>` |
| Online application form | ✅ Live | `/prijava/` |
| Form captures selected job position | ✅ Live | `izbrano_delovno_mesto` |
| Form captures name, email, **phone** (needed for SMS), CV (PDF) | ✅ Live | — |
| Interview booking page with real GHL calendar | ✅ Live | `/booking/` embeds LeadConnector calendar group `4Cx7yPFZ50QJqd40FQG8` |

---

## 3. ✅ What we fixed / added in this round (website)

All four website-side gaps identified in the audit have been implemented and build-verified.

1. **Application form now pushes leads into GoHighLevel.**
   On submit, the form sends a (non-blocking) webhook to GHL containing: `email`, `phone`, `izbrano_delovno_mesto` (+ slug), `lokacija_interesa`, `vir_prijave`, message, source URL, and a `tags: ["obrazec_izpolnjen"]` hint. This is what lets GHL know the form was completed — the trigger that stops "incomplete application" reminders and starts the booking invite.
   *(Runs alongside the existing email/database flow; a CRM outage can never block a candidate from applying.)*

2. **New fields captured: `lokacija_interesa` and `vir_prijave`.**
   - Added a required **"Lokacija razgovora"** dropdown to the form: **Kranj / Trzin / Vseeno**.
   - `vir_prijave` (traffic source, e.g. `meta`) is read from the landing URL (`?vir=` or `?utm_source=`), remembered for the visit, and submitted with the form.

3. **Meta Pixel added across the whole funnel.**
   Homepage, `/zaposlitve/`, job detail, `/prijava/`, `/booking/`. Tracks `PageView` everywhere, plus a **`Lead`** + custom **`SubmitApplication`** event when the form is submitted. This covers the "careers page visit" and "submitted online form" conversions.

4. **Interview-location addresses added to the booking page.**
   - **Kranj** – Ljubljanska cesta 24
   - **Trzin** – Brodišče 28, 2nd floor

---

## 4. 🔑 Pending activation (two values needed)

The code is built and deployed but stays **dormant** until these two values are provided. Both have one config location (`assets/js/config.js`, or as Vercel environment variables):

| Value | Where to get it | Config key |
|---|---|---|
| **GHL Inbound Webhook URL** | GHL → Automation → Workflows → new workflow → Add Trigger → *Inbound Webhook* → copy URL | `VITE_GHL_WEBHOOK_URL` |
| **Meta Pixel ID** | Meta Events Manager → your pixel → numeric ID | `VITE_META_PIXEL_ID` |

Until filled: no webhook is sent and no pixel loads — safe to keep deployed.

---

## 5. ⛔ What is NOT in our hands — GoHighLevel / CRM configuration

The following is **CRM work**, configured inside GoHighLevel by the CRM expert. It is **not** code and cannot be done from the website. The website already provides every signal the CRM needs (see section 3). This is the checklist the CRM expert must build:

### Step 1 — Meta Lead Ads intake
- Connect the Meta ad account to GHL.
- On new lead: create/update contact, set **Source = Meta**, add tag **`meta_lead_zaposlitev`**.
- Send automated **email + classic SMS** with the first CTA → **`https://www.win-win.si/zaposlitve/`** (never `/prijava/`).

### Step 2 — "Incomplete application" reminders
- Reminder 1 after **24h** (email + SMS), Reminder 2 after **48–72h** (email + SMS).
- After the final reminder: tag **`prijava_nedokoncana`** / **`arhiv_neodziven`**.
- **Stop condition:** contact receives tag **`obrazec_izpolnjen`** (the website sets this on form submit).

### Step 3 — On online form submitted (`obrazec_izpolnjen`)
- Remove tag **`prijava_nedokoncana`**.
- Map the webhook payload to custom fields: **`izbrano_delovno_mesto`**, **`lokacija_interesa`**, **`vir_prijave`**.
- Send **email + SMS** booking invitation, CTA → the GHL calendar / `/booking/`.

### Step 4 — "No booking yet" reminders
- Reminder 1 after **24h** (email + SMS), Reminder 2 after **48–72h** (email + SMS).
- After the final reminder: tag **`obrazec_brez_termina`**.
- **Stop condition:** candidate books an appointment.

### Step 5 — On appointment booked
- Add tag **`termin_rezerviran`**, remove **`obrazec_brez_termina`**.
- Send **confirmation email + SMS**, with messaging split by location:
  - **Kranj** – Ljubljanska cesta 24
  - **Trzin** – Brodišče 28, 2nd floor
- Confirmation must include: date & time, location, "arrive on time" instruction, and "reply if you can't attend so we can release the slot".

### Step 6 — Interview reminders
- **1 day before:** email + SMS.
- **1 hour before:** SMS only.
- SMS must be short and contain: who is writing, when the interview is, the location, and a clear "arrive on time" reminder.

### Step 7 — Pipeline stages (create in GHL)
1. Meta lead – submitted interest
2. Sent to careers page
3. Application incomplete
4. Form submitted
5. Waiting for appointment booking
6. Appointment booked
7. Attended interview
8. Did not attend interview
9. Accepted into next step
10. Not suitable / archived

---

## 6. Conversion tracking — who covers what

| Conversion | Tracked by | Status |
|---|---|---|
| Meta lead → careers page visit / click | Meta Pixel (website) + GHL | ✅ Website ready (needs Pixel ID) |
| Meta lead → submitted online form | Meta Pixel `Lead` event (website) + GHL tag | ✅ Website ready |
| Submitted form → booked interview | GHL (calendar booking) | ⛔ CRM |
| Booked interview → attended interview | GHL (manual/calendar status) | ⛔ CRM |
| Interview → accepted candidate | GHL (pipeline stage) | ⛔ CRM |

---

## 7. Summary

- **Website side: complete.** Pages, form, captured fields (job, location, source), GHL lead push, Meta Pixel, and booking-location info are all implemented and build-verified.
- **Pending from client/CRM:** two values to switch it on (GHL webhook URL + Meta Pixel ID).
- **CRM side: open.** All the automation logic in section 5 (Meta intake, SMS/email sequences, reminders with auto-stop, tags, pipeline, location-split confirmations, interview reminders) must be built inside GoHighLevel by the CRM expert. The website now hands GHL all the data it needs to do this.
