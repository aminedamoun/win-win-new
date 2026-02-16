# Decap CMS Authentication Setup

Your CMS is fully configured but needs authentication to be enabled. Follow these steps:

## Step 1: Enable Netlify Identity

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your **win-win-new** site
3. Go to **Site configuration** → **Identity**
4. Click **Enable Identity**

## Step 2: Enable Git Gateway

1. In the same Identity settings page
2. Scroll down to **Services** → **Git Gateway**
3. Click **Enable Git Gateway**
4. This allows the CMS to commit changes to your GitHub repository

## Step 3: Invite Yourself as a User

1. In Identity settings, go to the **Users** tab
2. Click **Invite users**
3. Enter your email address
4. Check your email and accept the invitation
5. Set your password

## Step 4: Access the CMS

1. Go to: `https://win-win-new.netlify.app/admin/`
2. Click **Login with Netlify Identity**
3. Enter your email and password
4. You'll now be authenticated and can edit content!

## Step 5: Edit Your Content

Once logged in, you'll see:
- **Homepage (EN)** - Click "Home Content" to edit English homepage
- **Homepage (SL)** - Click "Home Content (Slovenian)" to edit Slovenian homepage
- **About Page (EN)** - Click "About Content" to edit English about page
- **About Page (SL)** - Click "About Content (Slovenian)" to edit Slovenian about page

## What You Can Edit

### Homepage Content:
- Hero section (title, description, buttons)
- About section (title, stats)
- Services (core, support, market focus)
- Benefits
- Join section
- Call-to-action sections
- Process steps
- FAQ items
- And more!

### About Page Content:
- Hero section with background image
- Vision statement with image
- Mission statement with image
- Core values (unlimited items)
- Company culture highlights
- Statistics
- FAQ section

## How Editing Works

1. Click on a collection (e.g., "Homepage (EN)")
2. Click on "Home Content" to open the editor
3. Edit any field - the interface is visual and easy to use
4. Click **Save** at the top
5. Your changes are immediately committed to GitHub
6. Netlify automatically rebuilds your site (takes 1-2 minutes)
7. Your changes are live!

## For Job Listings

Job listings are managed in your **Supabase database**, not in the CMS:

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Table Editor** → **jobs** table
4. Click **Insert row** to add a new job
5. Or edit existing jobs directly in the table
6. Changes appear instantly on your website!

## Need Help?

If you see errors like:
- "Failed to load entries" - Make sure Git Gateway is enabled
- "Authentication required" - Complete steps 1-3 above
- "Can't save changes" - Check that you're logged in and Git Gateway is enabled

Your CMS is ready to go once you complete the authentication setup!
