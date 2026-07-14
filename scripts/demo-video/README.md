# Regenerating public/demo.mp4

The landing page embeds a real screen recording of the CostCook app.
To re-record after app UI changes (paths below assume the app worktree):

1. Scratch DB + seed (never touch a real database):
   `DATABASE_URL=file:$SCRATCH/demo.db npm run db:migrate` (in the app repo)
   then `node seed.mjs` (edit the DB path constant first — it seeds the
   chicken-piccata world: ingredients, purchases, sub-recipe, two dishes, menu).
2. Run the app: `DATABASE_URL=file:$SCRATCH/demo.db npm run dev -- --port 5199 --strictPort`
3. Bootstrap the demo account:
   `curl -X POST localhost:5199/api/auth/sign-up/email -H 'Content-Type: application/json' -d '{"email":"demo@costcook.demo","password":"demo-passw0rd!","name":"Rayan"}'`
4. `npm i playwright-core` somewhere scratch, edit paths in record-demo.mjs,
   `node record-demo.mjs` → WebM.
5. Transcode + poster (ffmpeg-static):
   `ffmpeg -i out.webm -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart -an public/demo.mp4`
   `ffmpeg -ss <clean-frame-sec> -i public/demo.mp4 -frames:v 1 -q:v 4 public/demo-poster.jpg`
   Pick a poster frame without a click-ripple; the shopping list with the
   order header is the money shot.
