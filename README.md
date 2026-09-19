# HEXKIT ACADEMY — static one-pager

Min-cost marketing site for **HEXKIT ACADEMY** (hexkitacademy.com).  
Hands-on industrial cobot workshops for middle / high school in OC / Irvine.

## Brand

Uses locked **Hexbolt** assets from `/workspace/hexkit-brand/v1/`:

- Palette: charcoal `#1A1D21`, electric lime `#B8F000`, off-white `#F4F5F0`, mid gray `#5C6370`
- Always titled **HEXKIT ACADEMY** (never bare HEXKIT as primary)
- No ArmMate blue/orange, no robot faces, no HEX BOTS toy look

## Files

```
hexkitacademy-site/
  index.html      # mobile-first single page
  styles.css      # Hexbolt + Inter
  vercel.json     # .tech → .com host redirect (308)
  README.md
  DEPLOY.md       # exact Vercel domain steps for Alex
  assets/
    lockup-horizontal.svg
    lockup-horizontal-reverse.svg
    lockup-stacked.svg
    mark.svg
    favicon-32.svg
    favicon-16.svg
    icons/*.svg
```

## Local preview

From this folder:

```bash
cd /workspace/hexkitacademy-site
python3 -m http.server 8080
```

Open http://127.0.0.1:8080/

Or: `npx serve .` if you prefer.

## Before go-live

1. **Formspree** — in `index.html`, replace `REPLACE_ME` in the form `action` with your Formspree form ID (free tier).
2. **Waitlist email** — `waitlist@hexkitacademy.com` is a placeholder; change the mailto if needed.
3. Deploy + attach domains — see **DEPLOY.md**.

## Legal / tone

Soft waitlist only for now. No invented workshop dates or prices. No paid brand campaigns until ready.
