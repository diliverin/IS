# India Spice — Coming Soon + Enquiry Form

A single coming-soon page (now the site's homepage) with a Name / Email /
Phone / B2B‑or‑B2C enquiry form. On submit:

- the **customer** gets a confirmation email
- **you** (the admin) get an email with the full submitted details

Includes a light/dark theme toggle (saved in the visitor's browser).

## 1. Gmail setup (required before this will send email)

Gmail no longer accepts your normal account password for apps like this —
you need an **App Password**:

1. Turn on 2-Step Verification on the Gmail account you want to send from:
   https://myaccount.google.com/security
2. Go to https://myaccount.google.com/apppasswords
3. Create a new App Password (name it e.g. "India Spice Website")
4. Copy the 16-character password it gives you — you'll use this, not your
   normal Gmail password.

## 2. Configure environment variables

Copy `.env.example` to `.env` and fill in:

```
EMAIL_USER=youraccount@gmail.com
EMAIL_PASS=the-16-character-app-password
ADMIN_EMAIL=owner@example.com   # where lead emails should land
```

`.env` is only used for local development — never commit it.

## 3. Run locally

```bash
npm install
npm start
```

Visit http://localhost:3000 and submit the form to test both emails.

## 4. Deploy to Vercel

This project is already structured the way Vercel expects:

- `/public` — static site (served automatically)
- `/api/enquiry.js` — serverless function for the form submission

Steps:

1. Push this folder to a GitHub repo (or run `vercel` from inside it with
   the Vercel CLI installed).
2. Import the repo in the Vercel dashboard, or run `vercel` / `vercel --prod`
   from the project folder.
3. In the Vercel project → **Settings → Environment Variables**, add:
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `ADMIN_EMAIL`
4. Redeploy. Your form at `https://your-project.vercel.app` will now send
   real emails through `/api/enquiry`.

`server.js` is only used when running locally with `npm start` — on Vercel,
`/api/enquiry.js` handles the same request instead, using the same
`lib/mailer.js` logic.

## Notes

- Every enquiry sends **two** emails: a short confirmation to the customer,
  and a full-detail lead email to `ADMIN_EMAIL`.
- If email sending fails (bad credentials, Gmail rate limit, etc.), the
  form shows a friendly error and nothing is silently lost — check your
  function logs (`vercel logs` or the Vercel dashboard) for the real error.
- The visible page-view counter script is already embedded in both
  `index.html` and `404.html`.
