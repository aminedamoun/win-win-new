# Decap CMS Setup Guide for Netlify

## Issues Fixed

1. ✅ Removed duplicate `netlify.toml` from `/admin/` folder
2. ✅ Completed the incomplete `config.yml` file (was cut off at line 87)
3. ✅ Fixed YAML structure to prevent parsing errors
4. ✅ Added proper configuration for both English and Slovenian content

## Required Netlify Configuration

To make Decap CMS work on your Netlify site, you need to configure the following:

### 1. Enable Netlify Identity

1. Go to your Netlify dashboard
2. Navigate to your site
3. Click on **Identity** in the top menu
4. Click **Enable Identity**

### 2. Enable Git Gateway

1. In the Identity section, scroll down to **Services**
2. Click **Enable Git Gateway**
3. This allows Decap CMS to commit changes to your GitHub repository

### 3. Configure Registration Settings

1. In Identity section, go to **Settings and usage**
2. Under **Registration preferences**, choose:
   - **Invite only** (recommended for security)
   - Or **Open** if you want anyone to register

### 4. Invite Users (if using Invite Only)

1. Go to **Identity** tab
2. Click **Invite users**
3. Enter email addresses for team members who need CMS access
4. They will receive an invite email with a setup link

### 5. Configure External Providers (Optional)

If you want to allow login via Google, GitHub, etc.:

1. In Identity settings, go to **External providers**
2. Add providers as needed (Google, GitHub, GitLab, Bitbucket)

## How to Access the CMS

Once configured, your team can access the CMS at:

```
https://your-site.netlify.app/admin/
```

### First-time Login Process

1. Visit `/admin/`
2. Click "Log in with Netlify Identity"
3. If invited: Click the link in your invite email first
4. Set up your password
5. Log in to the CMS

## What You Can Edit

The CMS is configured to edit:

### Homepage (English)
- Hero section (titles, description, CTA buttons)
- About section (title, description, stats)
- Services section (3 categories with cards)
- Benefits section
- Join section
- CTA section
- Process steps
- FAQ items
- SEO content

### Homepage (Slovenian)
- Same structure as English version
- Separate content file: `content/sl/home.json`

## File Structure

```
/admin/
  ├── index.html        # Decap CMS entry point
  └── config.yml        # CMS configuration

/content/
  ├── en/
  │   └── home.json     # English content
  └── sl/
      └── home.json     # Slovenian content
```

## Testing the Setup

1. Deploy these changes to Netlify
2. Enable Identity and Git Gateway
3. Invite yourself as a test user
4. Visit `/admin/` and log in
5. Try editing some content
6. Save and publish
7. Verify changes appear on your site

## Troubleshooting

### "Loading configuration…" forever
- Check that `config.yml` has no syntax errors (YAML is strict about indentation)
- Verify the file paths in `config.yml` match your actual files

### "Git Gateway Error"
- Make sure Git Gateway is enabled in Netlify Identity settings
- Verify your site is connected to a Git repository

### "You don't have sufficient permissions"
- Ensure you're logged in with Netlify Identity
- Check that your user has been invited to the site
- Verify Git Gateway is enabled

### URL keeps bouncing between /admin/ and /admin/#/
- This was likely caused by the duplicate `netlify.toml` (now fixed)
- Clear browser cache and try again

## Security Notes

- Use "Invite only" registration to control who can access the CMS
- Only invited users can log in and edit content
- All changes are committed to your Git repository with the user's identity
- You can review all changes in your GitHub commit history
