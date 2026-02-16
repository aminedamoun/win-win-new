# Managing Jobs Through CMS

Your CMS now includes a **Job Listings** collection where you can create, edit, and delete job postings.

## Accessing the CMS

1. Go to: `https://win-win-new.netlify.app/admin/`
2. Login with your Netlify Identity credentials
3. Click on **Job Listings** in the left sidebar

## Creating a New Job

1. Click **New Job Listings**
2. Fill in the job details:
   - **Job Title** - The position name (e.g., "Warehouse Worker")
   - **Location** - City or region (e.g., "Ljubljana")
   - **Employment Type** - Select from dropdown: Full-time, Part-time, Contract, or Temporary
   - **Department** - Optional (e.g., "Warehouse Operations")
   - **Salary Range** - Optional (e.g., "€1,200 - €1,500 per month")
   - **Short Description** - Brief summary of the role
   - **Responsibilities** - Click "Add responsibility" for each item
   - **Requirements** - Click "Add requirement" for each item
   - **Benefits** - Optional, click "Add benefit" for each item
   - **Application Deadline** - Optional date picker
   - **Published** - Toggle ON to make job visible on website
   - **Featured** - Toggle ON to highlight the job
   - **Posted Date** - When the job was posted

3. Click **Save**
4. Wait 1-2 minutes for Netlify to rebuild your site
5. Your new job appears at: `https://win-win-new.netlify.app/jobs.html`

## Editing an Existing Job

1. Click **Job Listings** in the sidebar
2. Select the job you want to edit
3. Make your changes
4. Click **Save**
5. Changes go live in 1-2 minutes

## Hiding a Job (Without Deleting)

1. Open the job in the CMS
2. Toggle **Published** to OFF
3. Click **Save**
4. The job won't appear on the website anymore

## Deleting a Job

1. Open the job in the CMS
2. Click **Delete entry** at the top
3. Confirm deletion
4. The job is removed from your website

## Important Notes

### After Adding/Removing Jobs

When you add or remove jobs through the CMS, you need to update the jobs index file:

1. Go to your repository on GitHub
2. Open `content/jobs-index.json`
3. Add or remove the job slug from the "jobs" array
4. Commit the change

Example:
```json
{
  "jobs": [
    "warehouse-worker-full-time",
    "customer-service-representative",
    "your-new-job-slug"
  ]
}
```

The job slug is automatically generated from the job title (lowercase, spaces replaced with hyphens).

### Tips

- **Featured Jobs** - Set a job as "featured" to highlight it (you can use this in your design later)
- **Application Deadline** - Set deadlines to automatically close applications
- **Department** - Use consistent department names for filtering
- **Salary Range** - Be clear about currency and period (per month/year/hour)

### Job Display

Jobs are displayed on these pages:
- English: `https://win-win-new.netlify.app/jobs.html`
- Slovenian: `https://win-win-new.netlify.app/jobs-sl.html`

Job detail pages:
- English: `https://win-win-new.netlify.app/job.html?id=job-slug`
- Slovenian: `https://win-win-new.netlify.app/job-sl.html?id=job-slug`

## Data Storage

- Jobs are stored as JSON files in `/content/jobs/`
- Each job is saved to GitHub automatically
- Changes trigger automatic site rebuilds
- Jobs are loaded from files (not database) for maximum performance

## Troubleshooting

**Job doesn't appear on website:**
- Check if **Published** toggle is ON
- Verify the job slug is added to `/content/jobs-index.json`
- Wait 2-3 minutes for the rebuild to complete

**Can't save changes:**
- Make sure you're logged in
- Check your internet connection
- Try refreshing the page and logging in again

**Need help?**
Check the main setup guide: `/admin/AUTHENTICATION_SETUP.md`
