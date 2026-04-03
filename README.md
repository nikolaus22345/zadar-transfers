# Zadar Transfers — web

Statična React SPA u **korijenu ovog repozitorija** (`index.html`, `assets/`, `vercel.json`).

## Vercel

1. Importaj repo [nikolaus22345/zadar-transfers](https://github.com/nikolaus22345/zadar-transfers).
2. **Root Directory:** ostavi **prazno** ili **`.`** (korijen repozitorija — tamo je `index.html`).
3. **Framework preset:** Other / ili “Static” ako postoji.
4. **Build Command:** ostavi prazno (nema builda).
5. Deploy.

`vercel.json` usmjerava client-side rute na `index.html`.

### E-mail s formi (samo Zadar)

Ne koristi se EmailJS (da se ne miješa s drugim projektima). Forme šalju na Vercel rutu **`/api/send-form`**, koja prosljeđuje na [Web3Forms](https://web3forms.com):

1. Napravi **Access Key** na Web3Forms i kao inbox stavi **zadartransfers.hr@gmail.com**.
2. U Vercelu dodaj env var **`WEB3FORMS_ACCESS_KEY`** i napravi **Redeploy**.

## GitHub

```bash
git remote add origin https://github.com/nikolaus22345/zadar-transfers.git
git branch -M main
git push -u origin main
```
