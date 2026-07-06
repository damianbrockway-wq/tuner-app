# Pluck — Complete Project Extraction

*A verify-by-inspection extraction so the project can be understood and rebuilt from nothing.*
*Extracted July 5, 2026. Source of truth: the live project folder and its git repo.*

---

## 1. Detailed summary

**Pluck** is a static Progressive Web App (PWA) that is both a **chromatic instrument tuner** and a complete **learn-to-play course** for ukulele and guitar. It runs entirely in the browser with **no backend, no build step, and no external dependencies** — every page is a self-contained HTML file with inline CSS and vanilla JavaScript. It is designed primarily for use on an iPhone, installed to the home screen as a standalone app.

**The problem it solves.** A beginner picking up a ukulele or guitar needs three things in sequence: get the instrument in tune, learn chords and the changes between them, then play real songs. Existing apps split these across paid products. Pluck folds the whole journey into one free, offline, install-to-home-screen web app, and — this is the core design insight — it **listens through the microphone and gives real-time feedback** at every step.

**How it works end to end.**
- The **tuner** (`index.html`) captures the mic, runs pitch detection on the audio, finds the nearest string for the selected instrument, and shows cents-off with a "lock-in" celebration when a string is in tune.
- **Chord Coach** (`chord-coach.html`) shows a target chord and verifies you're playing it, using a chromagram + cosine-similarity template match. The key trick is *verification* (does this audio match **this** chord?) rather than open recognition — which makes it a tractable, no-ML problem.
- **Lessons** (`lesson.html`, driven by data) walk a beginner from "first song" through 13 lessons (chords C, Am, F, G, and beyond; strumming; fingerpicking), each a sequence of steps that reuse the tuner and chord engine.
- **Song Mode** (`song-mode.html`) plays 14 songs as chord charts in a no-pressure **Wait mode** (advances when you play the chord) and a **Tempo mode** (metronome-driven play-along with timing feedback and metronome-bleed rejection).
- **Smart Practice** (`practice.html`) drills the specific chord changes you've learned, using a spaced-repetition priority model.
- **Ear training** (`ear.html`), **Profile & achievements** (`profile.html`), **Stats** (`stats.html`), **Song sheets** (`song-sheet.html`), and **Diagnostics/calibration** (`diag.html`) round out the app.
- A hidden **Rick Roll easter egg** plays a looping video full-screen when the tuner logo is tapped 7 times.

**Architecture at a glance.** A flat set of static pages sharing common patterns (Web Audio mic capture, Screen Wake Lock, an aurora/dark UI kit) but no shared JS bundle — each page inlines what it needs. State and progress are persisted entirely in the browser via `localStorage` under `pluck*` keys. A **service worker** (`service-worker.js`) precaches every page for offline use and serves navigations stale-while-revalidate. Hosting is **Cloudflare Pages** via direct upload with Wrangler; source is mirrored to **GitHub**.

**Current status.** Live and working at **https://tuner-app-dkn.pages.dev**. Service worker cache version is **`tuner-v65`**. The most recent work (uncommitted at extraction time) added the Rick Roll video prize (`prize.mp4`), fixed its close behavior, made it loop, and improved responsiveness (stale-while-revalidate navigation + memoized theme-color lookups in the tuner render loop). The last git commit is `3e83751 "80s game ideas saved + Rick Roll easter egg"`.

---

## 2. File & folder locations

Project root (the connected working folder):
`/Users/damianbrockway/Desktop/Claude Cowork /Tuner app/outputs/tuner-app/`

> Note: the same folder is reached inside the Linux workspace at `/sessions/jolly-brave-carson/mnt/tuner-app/`. Paths below use the user-facing root.

### Pages (HTML — each self-contained: inline CSS + JS)
| File | Lines | Purpose |
|---|---|---|
| `index.html` | 472 | **Tuner** (home/start screen). Instrument toggle (Guitar/Uke), pitch detection, cents display, lock-in celebration. Hosts the Rick Roll easter egg. |
| `lessons.html` | 127 | **Lesson hub** — lists lessons and shows progress; links into `lesson.html?l=N`. |
| `lesson.html` | 465 | **Guided lessons** — data-driven engine (`LESSONS` map, keyed 1–13), selected via `?l=N`. Each lesson is a sequence of steps reusing tuner + chord verification. |
| `practice.html` | 309 | **Smart Practice** — one-minute chord-change drills with spaced-repetition priority; adapts to chords learned in lessons. |
| `chord-coach.html` | 295 | **"Play this chord" trainer** — chromagram + cosine-similarity chord verification, diagrams, looped drills. |
| `song-mode.html` | 495 | **Song Mode** — 14 songs; Wait mode + Tempo mode; metronome, timing meter, metronome-bleed rejection, per-song best %. |
| `song-sheet.html` | 204 | **Song sheets** — chord-only charts (lyrics deliberately omitted for copyright safety). |
| `ear.html` | 168 | **Ear training** — "Name that Chord" and "Rhythm Echo" (tap-back) games. |
| `profile.html` | 131 | **Profile & achievements** — 13 sticky achievements + rank title, computed from `localStorage`. |
| `stats.html` | 125 | **Stats** — progress dashboard read from `localStorage`. |
| `diag.html` | 363 | **Diagnostics & calibration** — pitch/onset detection tuning, per-device latency & threshold calibration. |

### Assets
- `prize.mp4` — 1.27 MB, H.264/AAC portrait video (464×688, ~6 s). The Rick Roll "prize" played after 7 logo taps. (A compressed 143 KB demo copy, `demo_prize.mp4`, lives only in the scratch outputs folder, not the repo.)
- `icons/` — home-screen/app icons:
  - `icon-192.png` (192×192)
  - `icon-512.png` (512×512)
  - `icon-512-maskable.png` (512×512, maskable)
  - `icon-180.png` (180×180)
  - `apple-touch-icon.png` (180×180, iOS home screen)

### PWA / config
- `manifest.webmanifest` — PWA manifest (name "Pluck", standalone, portrait, theme `#0f1220`).
- `service-worker.js` — offline caching + navigation strategy; holds the cache-version string (`tuner-v65`).

### Docs / working notes
- `INSTALL.md` — run/deploy/install instructions (note: its "lessons 1..7" line is **stale** — there are 13).
- `GAME-IDEAS.md` — persisted "80s synthwave arcade" game-juice brainstorm + build-status checklist.

### Local tooling / housekeeping (not deployed)
- `.git/` — local git repo (branch `main`, remote `origin` → GitHub).
- `.wrangler/cache/pages.json` — cached Cloudflare Pages target (`account_id`, `project_name`).
- `.wrangler/cache/wrangler-account.json` — cached account id/name.
- `.DS_Store` — macOS folder metadata (should be gitignored; currently untracked).

### Design/spec docs (in the session outputs folder, not in the repo)
`pluck-project-extraction.md`, `pluck-teaching-engine-plan.md`, `song-mode-spec.md`, `chord-coach-phase1-spec.md`, `strumming-tempo-spec.md` — background research and specs generated during development.

---

## 3. Code & GitHub

- **Repository:** `https://github.com/damianbrockway-wq/tuner-app.git`
- **Default & active branch:** `main`
- **Working-tree state at extraction:** modified `index.html`, `service-worker.js`; untracked `prize.mp4`, `.DS_Store` — i.e., the latest video-prize and performance changes are **not yet committed/pushed**.
- **Recent commit history (newest first):**
  - `3e83751` 80s game ideas saved + Rick Roll easter egg
  - `c389eea` Achievements + Profile layer
  - `a11e954` Deepen teaching #4: Ear & Rhythm training
  - `e7aff9f` Add The Prodigal + God of Miracles (Josiah Queen)
  - `4672680` Add Watch Your Mouth (Josiah Queen)
  - `ae7760e` Deepen teaching #3: metronome-bleed rejection + timing meter + per-song best %
  - `50a3f55` Deepen teaching #1-2 + Lessons 11-13
  - `7b4804e` Deepen teaching: in-lesson string-by-string buzz diagnosis

**Codebase structure.** There is no framework and no module graph — the "structure" is the set of sibling HTML pages linked by `<a href>`. Each page follows the same internal shape: a `<style>` block (dark/aurora theme via CSS custom properties like `--good`, `--warn`, `--bad`, `--muted`), an HTML body, and a `<script>` block with the page's logic. Cross-page state is shared only through `localStorage`.

**Significant modules / entry points:**
- **Entry point:** `index.html` (also the manifest `start_url`).
- **Tuner engine (in `index.html`):** `TUNINGS` table (guitar & ukulele string frequencies), a `requestAnimationFrame` `loop()` that reads `analyser.getFloatTimeDomainData`, runs `detect()` (autocorrelation-style pitch detection), maps to nearest string, and drives the lock-in state machine + canvas `render()`.
- **Chord engine (in `chord-coach.html`, reused conceptually in `lesson.html` / `song-mode.html`):** `fftSize=16384` analyser → 12-bin chromagram → cosine similarity vs per-chord templates; match requires target = argmax + threshold + sustain.
- **Lesson engine (in `lesson.html`):** `const LESSONS = {1:{…}, … 13:{…}}`; `const STEPS = LESSONS[LNUM]` where `LNUM` comes from the `?l=` URL param; renders steps sequentially.
- **Detection/calibration (in `diag.html`):** NSDF/McLeod autocorrelation pitch detection and onset detection with adjustable thresholds persisted to `localStorage`.

---

## 4. Deployments (Cloudflare etc.)

- **Host:** Cloudflare Pages.
- **Project name:** `tuner-app`.
- **Cloudflare account id:** `0fe397151a1f828e183cf65c980ffbff` (account name: "Damian.brockway@gmail.com's Account").
- **Live URL:** `https://tuner-app-dkn.pages.dev`.
- **Publish method:** **Direct upload** via Wrangler, from the project root:
  `npx wrangler pages deploy . --project-name=tuner-app --branch=main`
- **Important deployment nuance:** a `git push` does **not** deploy. Only the `wrangler pages deploy` command publishes. Git is used for version history / GitHub mirror, not for CI deploys (no Pages Git integration is configured in the repo).
- **What is deployed where:** the entire static folder (all HTML, `prize.mp4`, `icons/`, `manifest.webmanifest`, `service-worker.js`) is uploaded as-is to Pages. There are no Workers, R2, D1, or KV resources.
- **Cache-busting:** every deploy must bump the `CACHE` string in `service-worker.js` (`tuner-vN`) so clients fetch fresh files; currently **`tuner-v65`**.

---

## 5. Databases & storage

**There is no database and no server-side storage.** All persistence is client-side `localStorage` in the browser, namespaced with a `pluck` prefix. Keys observed in the code:

| Key | Purpose |
|---|---|
| `pluckName` | User's display name (Profile). |
| `pluckLesson`, `pluckLesson1` … `pluckLesson13` | Per-lesson completion flags (value `'done'`). |
| `pluckSkill` | Skill/mastery model for spaced repetition. |
| `pluckStreak` | Practice-day streak counter. |
| `pluckBpm` | Preferred tempo (Song Mode / practice). |
| `pluckMetVol` | Metronome volume. |
| `pluckSongTime` | Per-song best timing %. |
| `pluckSongsDone` | Count/set of completed songs. |
| `pluckEarBest` | Best ear-training score. |
| `pluckAch` | Sticky achievements array. |
| `pluckLat` | Measured audio input latency (calibration). |
| `pluckChordCos` | Chord cosine-similarity threshold (calibration). |
| `pluckOnFloor`, `pluckOnRise`, `pluckOnRatio`, `pluckOnRefract` | Onset-detection calibration (noise floor, rise, ratio, refractory gap). |
| `pluckRepChord`, `pluckRepStrum`, `pluckRepCheck` | Spaced-repetition bookkeeping for chords/strums/checks. |

**Backups:** none — clearing browser data or uninstalling the PWA loses all progress. No export/import exists. The `prize.mp4` asset is the only binary "data" and lives in the repo/host.

---

## 6. Env vars & config

**No application environment variables.** The app is fully static and reads no runtime config. The only configuration values are constants in code and cached tooling files:

| Name | Where set | Purpose |
|---|---|---|
| `CACHE` (`tuner-vNN`) | `service-worker.js` line 1 | Service-worker cache namespace; bumped every deploy to invalidate old assets. |
| `ASSETS[]` | `service-worker.js` | Explicit precache list of every page/asset for offline use (includes `./prize.mp4`). |
| `account_id` = `0fe397151a1f828e183cf65c980ffbff` | `.wrangler/cache/pages.json` | Cloudflare account for Wrangler deploys. |
| `project_name` = `tuner-app` | `.wrangler/cache/pages.json` | Cloudflare Pages project target. |
| Manifest keys (`name`, `theme_color` `#0f1220`, `display` standalone, `orientation` portrait, `start_url` `./index.html`) | `manifest.webmanifest` | PWA install behavior. |
| `TUNINGS` (guitar/uke string frequencies) | `index.html` | Tuner reference pitches. |
| Detection thresholds (`fftSize`, cosine threshold, onset floor/rise/ratio/refractory, latency) | in-page constants + `localStorage` overrides | Audio detection tuning. |

No secret values appear anywhere in the codebase.

---

## 7. Credentials (reference only)

No secrets are stored in the repository. To rebuild/deploy, the operator needs:

| Credential | What it unlocks | Where it lives / how to obtain |
|---|---|---|
| **Cloudflare API token** (or interactive `wrangler login`) | Deploying to Cloudflare Pages project `tuner-app` | Not in repo. Either run `npx wrangler login` (browser OAuth) or set a `CLOUDFLARE_API_TOKEN` env var created in the Cloudflare dashboard (My Profile → API Tokens, with Pages:Edit). |
| **Cloudflare account access** | The account `0fe397151a1f828e183cf65c980ffbff` (Damian's) | Cloudflare dashboard login for damian.brockway@gmail.com. |
| **GitHub account / credentials** | Push access to `damianbrockway-wq/tuner-app` | GitHub login for the `damianbrockway-wq` account; push via HTTPS token or SSH key configured locally. |

`.wrangler/cache/wrangler-account.json` caches the account **id and name only** — no token. Never commit tokens; use `wrangler login` or an env-var token at deploy time.

---

## 8. Dependencies & tooling

- **Language:** HTML5, CSS3, vanilla JavaScript (ES2015+). No TypeScript, no framework.
- **Runtime APIs used (browser built-ins, no libraries):** Web Audio API (`AudioContext`, `AnalyserNode` with `fftSize` 4096 in the tuner / 16384 in chord/diag, oscillators), `getUserMedia` (mic), Screen Wake Lock API, Service Worker + Cache Storage, `localStorage`, Canvas 2D, `navigator.vibrate`, HTML `<video>`.
- **External/CDN dependencies:** **none** — verified by search; the app is fully offline-capable.
- **Build step:** none. Files are served/uploaded as-authored.
- **Package manifest:** none (`package.json` is not used).
- **Tooling required to develop/deploy:**
  - **Wrangler** (Cloudflare CLI) — invoked via `npx wrangler …`, which requires **Node.js + npm**.
  - **Python 3** — optional, for the local dev server (`python3 -m http.server`).
  - **git** — for version control / GitHub.
  - A browser with mic access over a secure context (HTTPS or `localhost`).

No pinned versions exist because there is no dependency manifest; Wrangler is pulled on demand by `npx` (recommend pinning, e.g. `npx wrangler@3 …`, when rebuilding).

---

## 9. Build & run steps

**Prerequisites:** Node.js + npm (for Wrangler), Python 3 (optional local server), git, a modern browser. Microphone features require HTTPS or `localhost`.

**Run locally**
1. `cd` into the project root.
2. Serve over http (mic needs a secure context; `localhost` qualifies):
   `python3 -m http.server 8000`
3. Open `http://localhost:8000/` and allow microphone access.

**Deploy (Cloudflare Pages)**
1. Bump the cache string in `service-worker.js` (`tuner-vN` → next number).
2. (Optional, for history) `git add -A && git commit -m "…" && git push`
3. Authenticate once: `npx wrangler login` (or set `CLOUDFLARE_API_TOKEN`).
4. Publish: `npx wrangler pages deploy . --project-name=tuner-app --branch=main`
5. Verify at `https://tuner-app-dkn.pages.dev` (may need a hard refresh / reopen to pick up the new SW version).

**Install on iPhone**
- Open the live URL in Safari → Share → **Add to Home Screen**.

**Tests:** there is no automated test suite. Verification during development was done by (a) `node --check` on extracted `<script>` blocks for syntax, and (b) manual on-device testing. Recommend adding at least a syntax lint to any rebuild.

---

## 10. External services & APIs

- **Cloudflare Pages** — static hosting + CDN + TLS for the live site (project `tuner-app`, account `0fe397151a1f828e183cf65c980ffbff`).
- **GitHub** — source hosting / backup (`damianbrockway-wq/tuner-app`). Not wired to auto-deploy.
- **No third-party runtime APIs** — the app calls no external HTTP endpoints, analytics, auth, or ad services at runtime. Everything runs locally in the browser. No webhooks.

---

## 11. Domains & DNS

- **Live domain:** `tuner-app-dkn.pages.dev` — a Cloudflare Pages subdomain (auto-provisioned; the `-dkn` suffix is Cloudflare's per-project hash).
- **Custom domain:** none configured (no registrar/DNS records to manage).
- **TLS/SSL:** automatic, managed by Cloudflare for the `*.pages.dev` domain.
- **DNS management:** N/A while on the default Pages subdomain. To add a custom domain later, it would be attached in the Cloudflare Pages project's *Custom domains* tab and DNS managed in Cloudflare.

---

## 12. CI/CD & automation

- **No CI/CD pipeline.** There are no GitHub Actions, no `.github/` workflows, and no Cloudflare Pages Git integration.
- **Deploys are manual** via the `wrangler pages deploy` command (see §9).
- **No scheduled/cron jobs, no deploy hooks.**
- **Manual release checklist (de facto process):** bump `service-worker.js` cache version → (commit/push) → `wrangler pages deploy` → verify on device.

---

## 13. Accounts & access

| Platform | Account / org | Role needed | How access is granted |
|---|---|---|---|
| Cloudflare | `Damian.brockway@gmail.com's Account` (`0fe397151a1f828e183cf65c980ffbff`) | Pages: Edit (to deploy) | Dashboard login or API token created under that account. |
| GitHub | `damianbrockway-wq` → repo `tuner-app` | Write (to push) | GitHub auth (token/SSH) for that user. |
| Apple / iOS | the end user's device | n/a | No developer account needed — it's a home-screen PWA, not an App Store app. |

No other accounts are required. The app itself has **no user accounts or auth** — all state is local to each device.

---

## 14. Step-by-step duplication guide

Recreate the entire project from nothing:

1. **Install prerequisites:** Node.js + npm, Python 3, git, and a modern browser.
2. **Create the project folder** and initialize git:
   `mkdir tuner-app && cd tuner-app && git init`
3. **Recreate the pages.** Author the 11 self-contained HTML files (each with inline `<style>` + `<script>`): `index.html` (tuner + easter egg), `lessons.html`, `lesson.html`, `practice.html`, `chord-coach.html`, `song-mode.html`, `song-sheet.html`, `ear.html`, `profile.html`, `stats.html`, `diag.html`. Keep the shared dark/aurora CSS-variable theme (`--good/--warn/--bad/--muted`). (If duplicating from the existing repo, simply `git clone https://github.com/damianbrockway-wq/tuner-app.git` and skip authoring.)
4. **Add the core engines** inside the relevant pages:
   - Tuner: `TUNINGS` table (guitar `E2 A2 D3 G3 B3 E4`, ukulele `G4 C4 E4 A4`), mic → `AnalyserNode` (`fftSize` 4096) → autocorrelation pitch detect → nearest-string + cents → lock-in state machine + canvas render loop.
   - Chord verification: `AnalyserNode` (`fftSize` 16384) → 12-bin chromagram → cosine similarity vs per-chord templates → match on argmax + threshold + sustain.
   - Lesson engine: `const LESSONS = {1..13}`, selected via `?l=N`.
   - Onset detection + calibration in `diag.html`, persisting thresholds to `localStorage`.
5. **Wire persistence:** read/write all progress to the `pluck*` `localStorage` keys listed in §5 (no backend).
6. **Add assets:** create the `icons/` set (192, 512, 512-maskable, 180, apple-touch) and place `prize.mp4` (portrait H.264/AAC) in the root.
7. **Author `manifest.webmanifest`:** name "Pluck", `start_url ./index.html`, `display standalone`, `orientation portrait`, `theme_color #0f1220`, and the three icons.
8. **Author `service-worker.js`:** set `const CACHE='tuner-v1'`; precache the full `ASSETS` list (every page + `prize.mp4` + manifest + icons); on `install` `cache.addAll` + `skipWaiting`; on `activate` delete old caches + `clients.claim`; on `fetch` use **stale-while-revalidate** for navigations (serve cache instantly, refresh in background, fall back to `./index.html` offline) and **cache-first** for static assets. Register it from each page.
9. **Test locally:** `python3 -m http.server 8000` → open `http://localhost:8000/`, allow mic, verify tuner lock-in, chord detection, lessons, song mode, and the 7-tap easter egg.
10. **Create hosting:** in Cloudflare, create a **Pages** project named `tuner-app` under the target account.
11. **Authenticate Wrangler:** `npx wrangler login` (or export `CLOUDFLARE_API_TOKEN`).
12. **Deploy:** bump the SW cache string, then
    `npx wrangler pages deploy . --project-name=tuner-app --branch=main`.
13. **Verify** the live `*.pages.dev` URL on desktop and iPhone; **Add to Home Screen** to confirm standalone PWA behavior and offline load.
14. **(Optional) Mirror to GitHub:** add the remote and push:
    `git remote add origin https://github.com/<you>/tuner-app.git && git add -A && git commit -m "init" && git push -u origin main`.
15. **Establish the release ritual** for every future change: bump `tuner-vN` → (commit/push) → `wrangler pages deploy` → hard-refresh to pick up the new service worker.

---

## Gaps & open questions

- **Uncommitted work.** `prize.mp4` and the latest `index.html` / `service-worker.js` changes (video prize, close/loop fixes, stale-while-revalidate, memoized theme lookups) are **not yet committed or pushed** to GitHub, and haven't necessarily been deployed. Commit + `wrangler pages deploy` to bring GitHub, Cloudflare, and local into sync.
- **Stale docs.** `INSTALL.md` still says "lessons 1..7"; there are **13** lessons (and pages `ear.html`, `profile.html`, `stats.html`, `song-sheet.html` aren't listed there).
- **Deploy token location.** The Cloudflare API token is not stored in the project (correct) — confirm where the operator keeps it (password manager / shell env) so a rebuilder can find it.
- **Icon source.** The PNG icons exist but the original vector/source (and the generator used) aren't in the repo; note where the master art lives if icons need regeneration.
- **`.DS_Store` is untracked** and should be added to a `.gitignore` (along with `.wrangler/` and `demo_prize.mp4`).
- **No automated tests or lint** — only manual + `node --check`. Consider adding a minimal CI syntax check if reliability matters.
- **Copyright posture (by design):** song sheets are **chord-only** and the Rick Roll is an **original 80s-synth homage** with the meme name only — no copyrighted melody or lyrics are reproduced. Preserve this constraint in any rebuild or catalog expansion.
