# Pluck on-device test checklist

Run on the iPhone (installed PWA) before every deploy. Takes about five minutes.

## Tuner
- [ ] Pluck each string individually: correct note shown, locks in under 1 second, one firework per string.
- [ ] Strum all strings (open and a chord) 5 times: NO new checkmarks appear on strings you didn't tune individually.
- [ ] Detune the uke A string very flat (more than a semitone): advice still says TIGHTEN (not "G — loosen").
- [ ] Long-press a string button: it pins as target; tap still plays the reference tone; re-long-press unpins.
- [ ] Background the app, take/simulate an interruption (timer alarm or call), return: mic recovers, or shows "Mic paused — tap to resume" and resumes on tap.
- [ ] Needle is steady when a note is held near 0 cents; responsive when far off.

## Chords & lessons
- [ ] Chord Coach: play the target chord — matches; play a different chord — doesn't match.
- [ ] Run diag calibration, change the cosine threshold, confirm Chord Coach behavior changes (calibration is honored).
- [ ] One lesson step of each type still works: tune, chord, seq, strum, metro.
- [ ] Song Mode wait mode advances on the right chord; tempo mode metronome doesn't self-trigger onsets.

## App shell
- [ ] All five tab-bar tabs navigate; active tab highlighted.
- [ ] Profile: export downloads a backup; import restores it.
- [ ] Airplane mode: app still loads (service worker).
- [ ] After deploy: force-quit, reopen twice, confirm the new cache version took (diag shows it, or check a changed element).
