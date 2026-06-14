# The Iron Edit

Next.js App Router site for The Iron Edit coaching brand.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill only the values you need locally.

## Current implementation notes

- The site uses a chic wellness/performance visual system and repo photos from `public/`.
- Login/signup is intentionally not part of the flow.
- Enrollment is available at `/enroll` and sends submissions to the owner by email.
- Razorpay routes are scaffolded. Checkout does not simulate success; it returns a configuration message until Razorpay keys and `RAZORPAY_ENROLLMENT_AMOUNT_INR` are set.
- Newsletter capture is scaffolded through owner email notifications. A database or newsletter provider can be added later.
- The hidden owner issue desk appears at `/?ownerTools=issues`. It requires `OWNER_ISSUE_SECRET`, creates GitHub Issues from text fields, and emails screenshots as attachments until storage is added.

## Environment variables

See `.env.example` for the full list.

Required for email-backed scaffold features:

- `EMAIL_USER`
- `EMAIL_APP_PASSWORD`

Required for owner issue creation:

- `OWNER_ISSUE_SECRET`
- `GITHUB_TOKEN`
- `GITHUB_REPO`

Required to enable Razorpay checkout:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_WEBHOOK_SECRET`
- `RAZORPAY_ENROLLMENT_AMOUNT_INR`

## Owner request workflow

1. Open `/?ownerTools=issues`.
2. Enter the owner passcode.
3. Submit website, content, blog, enrollment/pricing, or newsletter requests.
4. Review the created GitHub Issue.
5. Implement changes on a branch and open a pull request referencing the issue.

## Image performance

The app now uses Next.js image optimization for local images and avoids the global `images.unoptimized` setting. Above-the-fold imagery uses `priority`; lower sections use responsive `sizes` so phone and desktop layouts load appropriate variants. 
