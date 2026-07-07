# Pluck Roadmap

Where the app goes from here, in build order. Two goals: a tuner you can trust completely, and a course that genuinely teaches guitar as well as ukulele.

Grounded in a full code audit, outside research on tuners and guitar pedagogy, and an independent review of this plan. Realistic total: 6–8 weeks of part-time solo work. Every phase ships on its own.

---

## The headline finding

The pitch detector itself is good — a correct McLeod/NSDF implementation with octave-error guarding and parabolic interpolation. The problem is the layer around it, and the worst symptom is one you found yourself: **strumming makes all four fireworks go off.**

Mechanism (index.html): `lockHold` is a page-global that never resets when the target string changes. During a strum the detected pitch wanders between the strings' frequencies; the lock credit carries across each switch, so every string "locks" in about 60 ms once the first one fires. The ✓ marks then persist until you switch instruments. The tuner can be gamed into saying everything is in tune — that's a trust problem, and trust is the whole job of a tuner.

---

## Phase 0 — Surgical fixes (1–2 days)

1. **chord-coach.html line 270**: the calibrated `pluckChordCos` threshold is loaded and then ignored (hardcoded `>0.5`). One-token fix. Cheapest verified bug in the codebase.
2. **Cents readout**: re-seed `smoothCents = cents` whenever the target string changes, then display the smoothed value. Text, needle, and state line must all derive from the same number.
3. **Detection throttle**: run detect() every 2nd rAF, capped ~30/s. Halves CPU and battery; imperceptible.
4. **A4 calibration** (tuner only): `pluckA4` key, 415–445, default 440. Derive TUNINGS from it. The chord pages get it later via the shared module — don't chase all 8 call sites now.
5. **TESTING.md**: a short on-device checklist run before every deploy. With no test suite, this checklist is the plan's main safety net.
6. **Guitar spike (same week, decides Phase 3)**: hack diag.html locally — chroma floor 120→75 Hz, guitar chord pitch classes — and test minor/major discrimination (E/Em, A/Am, D/Dm) on a real guitar, 10 trials each. Pass ≥90% correct-accept, ≤5% wrong-chord-accept. This is the riskiest unknown in the whole plan; test it before building anything on it.

## Phase 1 — Tuner trust pack (3–4 days)

1. **Kill the fireworks bug.**
   - Reset `lockHold` to 0 on every target-string change.
   - Merged stability gate: lock requires ~400 ms continuously within ±8¢ AND all readings in that span inside a ±10¢ band. (Not a serial gate — that would double lock time.)
   - Polyphony guard: suppress lock accrual when strong NSDF peaks exist at non-harmonically-related lags, or when the chroma shows 3+ strong pitch classes.
   - Tick hygiene: a string's ✓ clears if that string is later heard >15¢ off.
   - Acceptance: 20 strums (open and chorded) → zero false ticks on strings not individually played. Honest single-string tuning locks in under 1 s; if it doesn't, loosen the constants — feel-tune on device.
2. **Target stickiness + manual pin.** Auto-switch target only when the pitch is >100¢ closer to a neighbor for >0.75 s. Long-press a string button pins it as the target (tap still plays the reference tone); a pin disables auto-switch until re-tapped or 10 s of silence. Fixes the uke trap where an A string >100¢ flat reads "G — LOOSEN" (wrong direction).
3. **Honest mic recovery.** Recovery handlers already exist (statechange, track.onended, watchdog, visibilitychange) but fail silently — iOS `resume()` during an interruption can no-op. Rework into a visible "Mic paused — tap to resume" state. Log `track.getSettings()` to diag to verify iOS actually honored the raw-audio constraints.
4. **Adaptive needle damping.** Stiff smoothing (α≈0.12) inside ±10¢, loose (α≈0.35) beyond ±25¢, linear between. Stable near zero, responsive far away — the feel that separates pro tuners in reviews.

## Phase 2 — Shared DSP module + guitar enablement (1.5–2 weeks)

1. **pluck-dsp.js** — one plain `<script src>` (no build step): chroma builder, template matcher, onset detector, pitch detector, diagram renderer, calibration loader. The same DSP currently exists in five drifting copies; that duplication is how the chord-coach bug happened.
2. **Version-skew guard**: load as `pluck-dsp.js?v=NN` with NN synced to the service-worker CACHE version. Otherwise stale-while-revalidate can pair fresh HTML with a stale module and brick all pages at once, worst offline.
3. **Migrate one page per commit** (chord-coach → lesson → song-mode → practice → diag), script-check + on-device smoke test each. Unify the drifted constants deliberately.
4. **Instrument parameterization**: an INSTRUMENTS table (string count, labels, open-string MIDI, chord voicings); diagram() drawing 4 or 6 strings plus barres; chroma floor to 75 Hz. If the Phase 0 spike showed weak discrimination, add harmonic down-weighting here (low-end FFT resolution is ~1.7 bins/semitone at E2, so this may be needed regardless).
5. **Alternate tunings data model** while touching TUNINGS: guitar Standard / Drop D / Eb; uke high-G / low-G. Picker UI can wait.

## Phase 3 — Guitar course (2.5–3.5 weeks, shipped in tranches)

**Namespacing (no migration):** existing unprefixed keys mean ukulele, forever. Guitar writes `pluckG*` keys. New `pluckInst` key persists the active instrument; every page that reads progress (lessons, lesson, practice, profile, stats, chord-coach, song-mode) checks it. `pluckSkill` entries get an instrument prefix — guitar Em and uke Em are different skills. profile.html's hardcoded 13-lesson loop and uke-tied achievements get per-instrument treatment.

**The 15 lessons** (informed by JustinGuitar/Andy Guitar structure; ~1.5–2× uke pacing, consolidation lessons built in):

1. Setup, posture, pick vs fingers, first strums — plus honest pain expectation-setting (weeks 2–3 are the worst, then it stops; this is the #1 quit reason).
2. Em + Am · one-minute changes · two-chord song.
3. D + string-set awareness (don't strum the low E — and the verifier checks that, penalizing low-string energy on D/C).
4. A + E · three-chord song (A-D-E) · down-up strumming.
5. Consolidation: no new chords; weakest pairs from spaced-rep data.
6. G. 7. C — the four-chord progressions minus F. 8. Dm + the D-DU-UDU pattern.
9. Mini-F / Fmaj7, framed as legitimate (the F "cheats" school) · doo-wop song.
10. 7th chords (A7/D7/E7) + 12-bar blues. 11. Power chords + palm muting — the "electric moment" uke never has.
12. Fingerpicking basics. 13. The full F-barre journey begins — never gates progress.
14. Sus chords and embellishments. 15. Capstone: two full songs at tempo + grade-2 tease.

**Rules carried from research:** detection is advisory, never a gate (Yousician's biggest failure is hard-gating on chord detection — false negatives become blockers); a "sounds off? show me the fingering" fallback instead of a fail state; songs stay chords-only (the safe copyright posture — no lyrics, no melody).

**Tranches:** ship 1–5 as "Guitar — early access," then 6–10, then 11–15. Never blocked on all fifteen.

## Phase 4 — Pro tuner layer (1–2 weeks, skippable)

1. "Tune all" guided flow: sweep low→high, auto-advance on lock, final recap. (GuitarTuna's most-loved behavior.)
2. Strobe mode: canvas band pattern driven by single-bin DFT phase at the target frequency — rotation direction = sharp/flat, speed = error. Genuinely more sensitive than a needle, ~100 lines. Reference: dsego/strobe-tuner.
3. Tunings picker UI for the Phase 2 presets.

## Phase 5 — Retention loop (1–2 weeks)

1. "Today": a 10-minute session composer — one due lesson step, weakest chord pairs, one song. The streak already exists; keep reminders gentle.
2. Song import: paste a chord progression as text ("C G Am F" per section) → playable in Song Mode, stored locally, riding the existing backup/export.
3. Backup nudge after each lesson milestone (Safari can evict localStorage; the export button only helps if people use it).

---

## Decision gates

- **After the Phase 0 spike**: guitar detection is either trusted (full verification in lessons) or advisory-only. The course ships either way.
- **After Phase 1**: the strum acceptance test on a real uke. Zero false ticks or Phase 1 isn't done.
- **After tranche 1**: does anyone use guitar early access? Let that pull tranches 2–3 forward or push Phase 4 up instead.

## Verification cadence (every deploy)

Extract-and-check script for all inline JS (plain `node --check` doesn't parse HTML) → bump the SW cache version (and the ?v= on pluck-dsp.js) → deploy → run TESTING.md on the phone.
