# Zadar Transfers — web

Statična React SPA u **korijenu ovog repozitorija** (`index.html`, `assets/`, `vercel.json`).

## Vercel

1. Importaj repo [nikolaus22345/zadar-transfers](https://github.com/nikolaus22345/zadar-transfers).
2. **Root Directory:** ostavi **prazno** ili **`.`** (korijen repozitorija — tamo je `index.html`).
3. **Framework preset:** Other / ili “Static” ako postoji.
4. **Build Command:** ostavi prazno (nema builda).
5. Deploy.

`vercel.json` usmjerava client-side rute na `index.html`.

## GitHub

```bash
git remote add origin https://github.com/nikolaus22345/zadar-transfers.git
git branch -M main
git push -u origin main
```
