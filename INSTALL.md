# Pluck — Guitar & Ukulele Tuner + Learn-to-Play

A static Progressive Web App (no backend, no build step, no external dependencies). Pages:

- `index.html` — chromatic tuner (the home / start screen); hosts the hidden easter egg
- `lessons.html` — the lesson hub + progress
- `lesson.html?l=1..13` — the 13 guided lessons
- `practice.html` — Smart Practice (one-minute changes, spaced repetition)
- `chord-coach.html` — "play this chord" trainer
- `song-mode.html` — play-along songs (Wait + Tempo modes)
- `song-sheet.html` — chord-only song sheets
- `ear.html` — ear training (Name that Chord + Rhythm Echo)
- `profile.html` — profile + achievements
- `stats.html` — progress dashboard
- `diag.html` — detection diagnostics + per-device calibration

## Run locally
Serve over http (mic needs a secure context; localhost counts):
`python3 -m http.server 8000` then open `http://localhost:8000/`.

## Deploy (Cloudflare Pages — direct upload; git push does NOT deploy)
1. Bump the cache string in `service-worker.js` (`tuner-vN`).
2. `git add -A && git commit -m "…" && git push`
3. `npx wrangler pages deploy . --project-name=tuner-app --branch=main`

Live at https://tuner-app-dkn.pages.dev

## Install on iPhone
Open the URL in Safari → Share → Add to Home Screen.
