# Abuve — Lewis & Clark Career Readiness App

Abuve is a career readiness web app built for Lewis & Clark College students. It helps students track experiences, manage their network, build their resume, and book Career Center appointments — all in one place.

Built by Abu Bakar (Class of 2029, Economics & Entrepreneurship). First place winner of the L&C Career Catalyst Challenge 2026.

**Live app:** https://lc-career-tracker.vercel.app

---

## Tech Stack

- React + Vite
- Tailwind CSS
- Lucide React (icons)
- React Router DOM
- Supabase (authentication — @lclark.edu emails only)
- Deployed on Vercel

---

## Pages

| Route | Page |
|---|---|
| `/` | Dashboard |
| `/experience` | Experience tracker |
| `/network` | Network contacts |
| `/skills` | Skills tracker |
| `/resume` | Resume builder |
| `/career-center` | Career Center |
| `/settings` | Settings |
| `/admin` | Faculty/Staff dashboard |
| `/login` | Login |

---

## Design Tokens

| Token | Value |
|---|---|
| Sidebar background | `#1a1714` |
| Hero background | `#433E3C` |
| Page background | `#F8F9FB` |
| Orange accent (buttons/icons/backgrounds) | `#E87722` |
| Orange text (accessibility) | `#B85A12` |
| Card background | White, 16px border radius |
| Primary text | `#111827` |
| Secondary text | `#6B7280` |
| Border | `#E5E7EB` |

---

## Critical Rules for Developers

1. **Never change the `id` field** of advisors in `BookAppointment.jsx` — only change display names. The `id` fields (`"sarah"`, `"emily"`) are tied to localStorage photo keys and will break photo uploads if changed.

2. **localStorage prefix is `abuve:`** — all keys must start with `abuve:` (e.g. `abuve:profile:name`). Never use `pioneerpath:` prefix.

3. **Orange `#E87722`** is for backgrounds, icons, and buttons only. For orange text use `#B85A12` for accessibility compliance.

4. **All git operations via Terminal** — never ask Claude Code to run shell commands.

5. **Photos in `public/`** are referenced as `/filename.jpg` not `./public/filename.jpg`.

---

## Running Locally

```bash
git clone https://github.com/abakar29/lc-career-tracker
cd lc-career-tracker
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Supabase

Authentication is enabled with email confirmation. Only `@lclark.edu` emails are allowed — validated in `Login.jsx`.

---

## Deployment

Deployed automatically on Vercel. Every push to `main` triggers a redeploy. A `vercel.json` rewrite rule handles React Router refresh issues.
