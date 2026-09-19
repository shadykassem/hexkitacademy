# Deploy HEXKIT ACADEMY on Vercel

Domains **hexkitacademy.com** and **hexkitacademy.tech** are already purchased on Vercel.  
You only need to attach them to this project and set the `.tech` → `.com` redirect.

`vercel.json` in this folder already includes a **308** host redirect:

- `hexkitacademy.tech/*` → `https://hexkitacademy.com/:path*`
- `www.hexkitacademy.tech/*` → `https://hexkitacademy.com/:path*`

---

## A) Create the project

### Option 1 — Upload / CLI from this folder

1. Install Vercel CLI if needed: `npm i -g vercel`
2. From this directory:

```bash
cd /workspace/hexkitacademy-site
vercel
```

3. Follow prompts → create a **new project** (static; framework preset **Other** is fine).
4. Production deploy: `vercel --prod`

### Option 2 — GitHub

1. Push this folder to a GitHub repo.
2. [vercel.com](https://vercel.com) → **Add New…** → **Project** → Import the repo.
3. Root directory = repo root (or the folder that contains `index.html`).
4. Framework: **Other** / no build command needed. Output = `.` (static).
5. Deploy.

---

## B) Attach domains (already bought on Vercel)

1. Open the project → **Settings** → **Domains**.
2. **Add** `hexkitacademy.com`
3. **Add** `www.hexkitacademy.com` (optional but recommended; Vercel can redirect www → apex or vice versa).
4. **Add** `hexkitacademy.tech`
5. **Add** `www.hexkitacademy.tech` (optional).

Because the domains were bought through Vercel, DNS is usually already on Vercel nameservers—no registrar hop. Just attach them to **this** project.

### Set `.tech` to redirect to `.com`

**Preferred (already in repo):** keep `vercel.json` redirects. After both hosts are on the same project, visiting `hexkitacademy.tech` should 308 to `https://hexkitacademy.com/...`.

**Also in UI (belt-and-suspenders):**

1. **Settings** → **Domains** → click `hexkitacademy.tech`
2. Choose **Redirect to Another Domain** → `hexkitacademy.com`
3. Use **308** / permanent if offered
4. Repeat for `www.hexkitacademy.tech` if added

Primary site hostname should be **hexkitacademy.com**.

---

## C) Checklist after deploy

- [ ] https://hexkitacademy.com loads this one-pager
- [ ] Favicon shows Hexbolt mark
- [ ] https://hexkitacademy.tech redirects to https://hexkitacademy.com
- [ ] Formspree `REPLACE_ME` replaced; test one waitlist submit
- [ ] Mailto / inbox address confirmed

---

## If host redirect in vercel.json doesn’t apply

Some Vercel setups prefer domain-level redirects in the Domains UI only. Use **Settings → Domains → Redirect to Another Domain** as in section B. Document that path for Alex—no extra DNS purchase needed.

## Cost

Static site on Vercel hobby/free tier is enough for this waitlist page. Formspree free tier handles the form until volume grows.
