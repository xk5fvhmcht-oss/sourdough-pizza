# Sourdough Pizza — by Omar

A sourdough **pizza** dough calculator, built around the one thing your starter actually tells you: **how fast it doubles.** Give it that and your schedule, and it solves for the starter to weigh — then shows when the ball is *openable*, not just risen. Installable PWA, works offline, no frameworks.

**The problem it solves:** great sourdough *bread* doesn't translate to pizza. Bread is shaped into a banneton before the fridge and only has to hold its shape and get scored — a slightly over-fermented loaf still bakes beautifully. Pizza asks you to open a cold ball thin and load it, which needs a much narrower window: gluten relaxed and extensible but not blown out. This app aims the ferment at *that* window and tells you when to pull and how long to temper.

## How it reasons

Fermentation rise is microbial growth, which is roughly exponential while the culture is active. Two facts give you everything.

**1. Doublings → the starter solve.** If your starter doubles every `τ` hours, a phase of length `t` at that temperature delivers `t/τ` doublings. The dough is ready at a *fixed* maturity, so more starter needs fewer doublings:

```
starter%  =  R · 2^(−D)
D         =  Σ phases of  (t/τ) · Q10^((T − T_counter)/10)
```

`D` is the total doublings your schedule delivers; `R` is the readiness constant. `τ` is measured at your counter, so the warm phase is just `t/τ` and the fridge is scaled down by the Q10 term (~5× slower at 37 °F).

**2. The anchor.** `R` is set from your **bread** (20% starter, pulled at peak) minus a "pulled before peak" offset, because pizza wants to land a notch earlier so there's gluten left to stretch. That offset is the one thing only your own bakes can pin — so **the journal overrides it.** Log a bake, mark how the ball came out (tight / perfect / slack), and the next suggestion shifts toward what works in *your* kitchen. With a logged "perfect" bake, the app stops guessing and uses that.

**3. The three lines = your starter's moods.** Your starter doubling time isn't one number; it's a range (4–8 h). The lively edge reaches ready *earlier*, the sluggish edge *later*. The band between them is the app being honest that it's guessing — and it's why the clock can't pin the moment. If you measure today's doubling time and enter it, the band collapses and the answer gets sharp. Otherwise: **watch the ball, not the clock** — that's what the finger test is for.

### Honest limits
- Assumes exponential growth; past ~48 h the cold turns tangy and the dough gets fragile (sourdough's real ceiling, lower than commercial yeast).
- Assumes Caputo 00 and a 100% (equal flour/water) starter.
- Models the fridge cool-down with Newton's law of cooling (a ~2 h time constant for a balled dough), so fermentation slows over the first few hours rather than stopping the instant the dough goes in. The cooling constant is an estimate; it ignores ball size, spacing, and fridge airflow. Small salt/hydration effects on rate are also ignored, and the journal anchor absorbs most of the slack.

## What it gives you
- Starter **%** and **grams**, plus the lively/typical/sluggish range
- **Per-mood weigh-out.** The sluggish / best-guess / lively chips each show the starter in grams, and tapping one recomputes the entire recipe (flour, water, starter, salt) and the graph timing for that dose — no mental math to convert a percentage you didn't pick.
- A **progress-to-openable** graph (0–100%): the openable line is 100%, the faint zone above is "over." Three curves are your starter's good-day / typical / slow-day moods, and where each crosses 100% is when the ball is ready.
- **Real day & clock times** everywhere. Set when you'll mix and the graph's x-axis, the ready dots, the fridge-in time, and the temper pull-time all become actual times like "Sat 6 PM" — no hour-counting. A gentle nudge appears if a typical day would land openable in the small hours, with how to shift it back toward dinnertime.
- Full weigh-out (flour, water, starter, salt 2.8% Neapolitan) + final hydration
- **Water temperature** for the spiral mix (so friction heat doesn't push the dough too warm)
- **Temper + finger-test** guidance — pull 1–2 h ahead, ready when a floured dent fills slowly
- A **bake journal** that tunes the engine (saved locally on your device)

## Ovens & hydration
Two buttons snap the water to the bake:
- **🔥 Gozney Dome** (~800 °F, 60–90 s) → **64%**. Fast bake retains moisture; Caputo 00 stays extensible.
- **🏠 Home steel 550 °F** (5–8 min) → **67%**. Slow bake dries the crust, so it needs more water. *This is the number to raise toward 70% once a King Arthur bread-flour toggle is added — that flour is built for it.*

Drag to override anywhere in 58–70%. Caputo 00 goes slack past ~68%.

## Deploy on GitHub Pages
Put every file at the repo root, then **Settings → Pages → Deploy from a branch → main / (root)**. Open `https://<you>.github.io/<repo>/`. On iPhone: Safari → Share → Add to Home Screen. All paths are relative, so it works under a project subpath. Bump `VERSION` in `sw.js` after any edit.

## Files
`index.html` (the whole app), `sw.js` (offline), `manifest.webmanifest`, four icons.

## Local preview
A service worker and localStorage need `http://`, not `file://`:
```
python3 -m http.server 8000   # then open http://localhost:8000
```

---
*This is a first calibration-ready build. The defaults are a best guess; your bakes make it yours.*
