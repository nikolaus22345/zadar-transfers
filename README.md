# Zadar Transfers — web

Statična React SPA u mapi `zadar-transfer-hub-main/`.

## Vercel

1. Spoji repo [nikolaus22345/zadar-transfers](https://github.com/nikolaus22345/zadar-transfers) u Vercelu (**Import Project**).
2. **Root Directory:** postavi na `zadar-transfer-hub-main` (važno — tamo je `index.html` i `vercel.json`).
3. **Build:** nije potreban (nema `package.json` builda) — ostavi prazno ili “Other”.
4. Deploy.

`vercel.json` šalje sve rute koje nisu pod `/assets/` na `index.html` (client-side routing).

## GitHub

```bash
git remote add origin https://github.com/nikolaus22345/zadar-transfers.git
git branch -M main
git push -u origin main
```
