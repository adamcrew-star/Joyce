---
name: testing-kitsap-reviews
description: Test the Kitsap Roof Pros customer review redirect end-to-end on the deployed GitHub Pages site.
---

# Kitsap Reviews Testing

## Devin Secrets Needed

- None for verifying the public redirect.
- A Google account is required only to inspect the authenticated review-star
  selector. The customer must sign in directly in Chrome; do not request,
  handle, or save their Google password.

## Environment

- Live page: `https://reviews.kitsaproofpros.com/`
- Official review URL: `https://g.page/r/CdXw4tNKYRNhEBM/review`
- Google Place ID: `ChIJX_T0-VQ7kFQR1fDi00phE2E`
- Google feature/CID:
  `0x54903b54f9f4f45f:0x6113614ad3e2f0d5`

No local server or dependency installation is needed for the primary runtime
test. Confirm the Pages workflow completed and fetch the live HTML/JavaScript
with a cache-busting query parameter before recording.

## Primary UI Test

1. Open the live page and confirm the four emoji choices and Google disclosure.
2. Start recording only after the page is ready.
3. When verifying the all-Google version, click `Not great` first. This
   distinguishes it from an older or review-gated build that might route
   negative feedback to an email form.
4. Confirm the original page navigates to Google Maps for Kitsap Roof Pros.
5. Return to the live page and click `Excellent` to verify the two extreme
   choices use the same official destination.
6. Verify the Google destination contains the expected Place ID or CID.
7. When signed out, record Google's authentication prompt as evidence that the
   correct review flow was reached. Mark the authenticated star selector
   untested unless it is actually visible.

## Browser Window Behavior

Google authentication might open a separate Chrome window while the Maps review
destination remains in the original browser target. Use `wmctrl -l -x` to
identify both windows and activate the Kitsap page before recording:

```bash
wmctrl -a 'Share Your Experience | Kitsap Roof Pros - Google Chrome for Testing'
```

Do not interpret Google's authentication window as the site calling
`window.open`; verify the application code still uses
`window.location.assign()`.

## Assertions

- The live page clearly says customers select their stars on Google.
- The redirect reaches Kitsap Roof Pros, not another business.
- The redirect uses the official Google review link.
- Do not claim stars are preselected. Google's supported review URL does not
  expose a rating-prefill parameter.

## Multi-platform Review Prototypes

- Select the lowest rating first and confirm every intended public platform
  remains available. This distinguishes a neutral platform-choice design from
  review gating.
- Do not treat a `share.google` URL as a direct review link without testing it
  in Chrome. It might resolve to Google Search or a business listing instead
  of the review composer.
- A Facebook Reviews URL can use `?sk=reviews`. When signed out, Facebook might
  cover the page with a login dialog; verify the page ID, business name, and
  `sk=reviews` URL before marking the destination correct.
- Test at a mobile width because review-request links are commonly opened from
  text messages. Confirm rating choices and platform cards do not clip or
  overflow horizontally.
