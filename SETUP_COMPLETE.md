# Win-Win Website Setup Complete

Your website is now fully functional with a Content Management System (CMS) and database integration!

## What's Been Set Up

### 1. Decap CMS (Netlify CMS) Integration

Your CMS is now configured and ready to use. Once you deploy to Netlify and enable Netlify Identity, you can:

- Edit Homepage content (English & Slovenian)
- Edit About Page content (English & Slovenian)
- Manage all text, images, and structure through a user-friendly interface

**Access your CMS at**: `https://your-site.netlify.app/admin/`

### 2. Supabase Database

A complete database system is set up with:

#### Jobs Table
- Stores all job listings with multilingual support (EN/SL)
- Fields include: title, description, requirements, responsibilities, benefits, location, type, salary range
- Already contains 3 sample jobs:
  - Field Sales Advisor (B2C)
  - Call Center Sales Agent
  - B2B Sales Consultant

#### Applications Table
- Stores all candidate applications
- Links applications to specific jobs
- Tracks application status (new, reviewed, interview, hired, rejected)
- Stores: name, email, phone, message, and timestamps

### 3. Professional Images

All pages now use high-quality stock photos from Pexels CDN:
- About page with professional team and office images
- Hero sections with relevant backgrounds
- Optimized for fast loading

### 4. Functional Pages

#### Homepage (`index.html` & `index-sl.html`)
- Fully editable via Decap CMS
- All content loaded from JSON files
- Supports English and Slovenian

#### About Page (`about.html` & `about-sl.html`)
- Vision & Mission sections
- Core Values with images
- Company Culture highlights
- Impact statistics
- FAQ section
- All content editable via CMS

#### Jobs Page (`jobs.html` & `jobs-sl.html`)
- Loads jobs directly from Supabase
- Filter by location and type
- Search functionality
- Individual job detail pages

#### Application System (`apply.html` & `apply-sl.html`)
- Form validation
- Submits directly to Supabase
- Success confirmation
- Tracks which job was applied for

## Files Created/Updated

### New Files
- `/content/en/about.json` - About page English content
- `/content/sl/about.json` - About page Slovenian content
- `/assets/js/supabase-client.js` - Database connection
- `/assets/js/jobs-db.js` - Database operations for jobs and applications
- `/admin/SETUP.md` - Netlify setup instructions
- `/SETUP_COMPLETE.md` - This documentation file

### Updated Files
- `/admin/config.yml` - Added About page to CMS collections
- `/assets/js/about.js` - Now loads from JSON files
- `/assets/js/about-sl.js` - Now loads from JSON files
- `/assets/js/apply.js` - Now submits to Supabase database

## How to Use

### Netlify Setup (Required for CMS)

1. **Enable Netlify Identity**
   - Go to your Netlify site dashboard
   - Navigate to Site Settings → Identity
   - Click "Enable Identity"

2. **Enable Git Gateway**
   - Under Identity → Services
   - Click "Enable Git Gateway"

3. **Invite Team Members**
   - Go to Identity → Invite users
   - Add email addresses of team members who should have CMS access
   - They'll receive an invitation email

4. **Access the CMS**
   - Visit `https://your-site.netlify.app/admin/`
   - Log in with your Netlify Identity credentials
   - Start editing content!

### Managing Content

#### Edit Homepage Content
1. Log into CMS (`/admin/`)
2. Select "Homepage (EN)" or "Homepage (SL)"
3. Edit any section:
   - Hero section
   - About section
   - Services
   - Benefits
   - FAQ
   - And more!
4. Click "Save" - changes go live immediately after deployment

#### Edit About Page Content
1. Log into CMS
2. Select "About Page (EN)" or "About Page (SL)"
3. Edit:
   - Vision & Mission
   - Core Values (with images)
   - Company Culture
   - Statistics
   - FAQ

### Managing Jobs (Supabase)

#### View Jobs in Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Select `jobs` table
4. View, edit, or add new jobs

#### Add a New Job
1. In Supabase, go to the `jobs` table
2. Click "Insert row"
3. Fill in all fields (both EN and SL versions):
   - `slug`: URL-friendly identifier (e.g., "sales-manager")
   - `title_en` / `title_sl`: Job titles
   - `description_en` / `description_sl`: Job descriptions
   - `requirements_en` / `requirements_sl`: Array of requirements
   - `responsibilities_en` / `responsibilities_sl`: Array of responsibilities
   - `benefits_en` / `benefits_sl`: Array of benefits
   - `location_en` / `location_sl`: Job location
   - `type_en` / `type_sl`: Employment type
   - `salary_en` / `salary_sl`: Salary information
   - `is_active`: Set to `true` to make visible

### Viewing Applications

1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Select `applications` table
4. View all submitted applications with:
   - Applicant name and contact info
   - Which job they applied for (if applicable)
   - Application status
   - Submission timestamp

#### Update Application Status
1. Click on an application row
2. Change the `status` field to:
   - `new` - Just submitted
   - `reviewed` - Application reviewed
   - `interview` - Scheduled for interview
   - `hired` - Applicant hired
   - `rejected` - Application rejected

## Technical Details

### Database Connection
- Environment variables are pre-configured in `.env`
- Supabase client is initialized in `supabase-client.js`
- All database operations use the Supabase JavaScript client

### Security
- Row Level Security (RLS) is enabled on all tables
- Public users can:
  - View active jobs
  - Submit applications
- Authenticated users can:
  - Manage all jobs
  - View and update applications

### Content Structure

#### JSON Content Files
Content is stored in `/content/[language]/` directory:
- `home.json` - Homepage content
- `about.json` - About page content

These files are:
- Loaded dynamically by JavaScript
- Editable through the CMS
- Version controlled in Git

### Image Guidelines

When adding images through the CMS:
- Use Pexels URLs for professional stock photos
- Format: `https://images.pexels.com/photos/[ID]/pexels-photo-[ID].jpeg?auto=compress&cs=tinysrgb&w=800`
- Recommended sizes:
  - Hero images: `w=1920`
  - Card images: `w=800`
  - Thumbnails: `w=400`

## Next Steps

1. **Deploy to Netlify** (if not already done)
   - Push your changes to GitHub
   - Netlify will automatically deploy

2. **Set up Netlify Identity** (follow steps above)

3. **Test the CMS**
   - Log in and make a small edit
   - Verify changes appear on your site

4. **Add Your First Real Job**
   - Use the Supabase dashboard
   - Follow the job creation steps above

5. **Customize Content**
   - Update homepage text to match your brand
   - Add your company's actual statistics
   - Update FAQ with your real questions

## Troubleshooting

### CMS Not Loading
- Make sure Netlify Identity is enabled
- Check that Git Gateway is enabled
- Verify you're accessing through your Netlify URL

### Jobs Not Showing
- Check Supabase connection in browser console
- Verify `is_active` is set to `true` on job records
- Check environment variables in `.env`

### Applications Not Saving
- Check browser console for errors
- Verify Supabase connection
- Check RLS policies in Supabase dashboard

## Support

For questions about:
- **Netlify CMS**: Check [Decap CMS Documentation](https://decapcms.org/docs/)
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **Deployment**: Check [Netlify Documentation](https://docs.netlify.com/)

---

**Congratulations!** Your Win-Win careers website is now fully operational with CMS and database integration.
