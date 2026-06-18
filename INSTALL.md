# Putting the Tuner on your iPhone

The app is a Progressive Web App (PWA). To add it to your home screen, the iPhone's
Safari needs to open it from a web address (https). The mic only works over https too,
so a quick free host is the way to go.

## Easiest path — Netlify Drop (free, no account, ~1 minute)

1. On your computer, go to https://app.netlify.com/drop
2. Drag the whole `tuner-app` folder onto the page.
3. Netlify gives you a link like `https://your-name.netlify.app` — open it.
4. Open that same link in **Safari on your iPhone**.
5. Tap the **Share** button → **Add to Home Screen** → **Add**.
6. The Tuner icon now sits on your home screen and opens full-screen like an app.

## Other free hosts that work the same way
- GitHub Pages (if you use GitHub)
- Cloudflare Pages
- Vercel

## Using it
- **Tap a string note** (E2, A2, …) to hear the correct reference pitch and tune by ear.
- **Start microphone**, then play a string. The note name and meter show whether you're
  flat or sharp — tighten the string to go up (sharp), loosen to go down (flat).
  The display turns green when you're in tune.
- Switch between **Guitar** (E A D G B E) and **Ukulele** (G C E A) at the top.

## Note about the mic
iPhone Safari only allows microphone access on secure (https) pages, which is why hosting
matters. Once added to your home screen it will ask for mic permission the first time — tap Allow.
Reference-tone mode works even offline after the first load.
