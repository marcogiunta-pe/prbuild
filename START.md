# PRBuild – Start the app

## 1. Kill any old dev servers (important!)

```bash
npm run dev:kill
```

## 2. Start the dev server

```bash
cd "/Users/marcogiunta/Library/Mobile Documents/com~apple~CloudDocs/Cursor/PRbuild"
npm run dev
```

The script finds an available port automatically. Wait until you see:

```
🚀 Starting dev server on port 24678
   Open: http://127.0.0.1:24678
✓ Ready in ...
```

## 3. Open in browser

Use the URL shown (typically **http://127.0.0.1:24678** or **http://localhost:24678**).

## 4. You should see

The PRBuild landing page (hero, features, pricing, etc.).

---

**If something's wrong**

| What you see | Do this |
|--------------|---------|
| 404 | Run `npm run dev:kill` then `rm -rf .next` then `npm run dev` again |
| "Connection failed" / "refused" / "can't reach" | 1) In Terminal, run `npm run dev` and wait for "Ready". 2) Try http://127.0.0.1:8765 instead of localhost. 3) Check if another app is blocking the port. |
| "Invalid response" | Use **http://** not https:// |
| Blank screen | Hard refresh (Cmd+Shift+R) or try a different browser |

More detail: see **DEV.md**.
