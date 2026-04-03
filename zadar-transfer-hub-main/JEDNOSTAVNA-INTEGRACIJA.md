# ðŸš€ JEDNOSTAVNA WORDPRESS INTEGRACIJA

Ovo je **NAJJEDNOSTAVNIJE** rjeÅ¡enje - bez PHP backend-a, bez baze podataka, samo autocomplete i redirect!

## âœ… Å to trebaÅ¡ napraviti (5 koraka)

### 1ï¸âƒ£ Kopiraj HTML formu u Elementor

1. Otvori stranicu u **Elementor editoru**
2. Dodaj **HTML widget**
3. Otvori `elementor-simple-booking-form.html`
4. Kopiraj **cijeli sadrÅ¾aj** i zalijepi u HTML widget
5. **VAÅ½NO**: Promijeni `action` URL u formi na svoju domenu:
   ```html
   <form id="simple-booking-form" method="GET" action="https://TVOJA-DOMENA.com/booking">
   ```

### 2ï¸âƒ£ Dodaj JavaScript za autocomplete

**Metoda A - Custom Code (preporuÄeno ako imaÅ¡ Elementor Pro):**
1. Idi na **Elementor â†’ Custom Code**
2. Klikni **Add New**
3. Ime: "Booking Form Autocomplete"
4. Location: **Body - End**
5. Otvori `simple-booking-script.js`
6. Kopiraj sadrÅ¾aj i zalijepi
7. Spremi

**Metoda B - Theme Functions:**
1. Idi na **Appearance â†’ Theme File Editor**
2. Otvori `functions.php`
3. Na kraju datoteke dodaj:
```php
// Booking form autocomplete script
function enqueue_simple_booking_script() {
    ?>
    <script>
    // Ovdje zalijepi cijeli sadrÅ¾aj iz simple-booking-script.js
    </script>
    <?php
}
add_action('wp_footer', 'enqueue_simple_booking_script');
```

**Metoda C - Code Snippets Plugin (najlakÅ¡e):**
1. Instaliraj **Code Snippets** plugin
2. Idi na **Snippets â†’ Add New**
3. Kopiraj kod iz `simple-booking-script.js`
4. Otvori ga s `<script>` i zatvori s `</script>` tagovima
5. Run everywhere: **Frontend**
6. Aktiviraj snippet

### 3ï¸âƒ£ Testiraj formu

1. Otvori svoju WordPress stranicu
2. Kreni tipkati u "PICK UP" polje (npr. "Zadar")
3. **Trebaju se prikazati suggestions** s ikonicama
4. Odaberi lokaciju iz dropdown-a
5. Popuni sve ostale podatke
6. Klikni **SEARCH**
7. **Trebalo bi te redirectati** na `/booking` stranicu s parametrima

### 4ï¸âƒ£ Provjeri da React app Äita URL parametre

Tvoja React `/booking` stranica veÄ‡ Äita parametre iz URL-a preko `useSearchParams()`.

Kada WordPress forma submitta, URL Ä‡e izgledati ovako:
```
https://zadar-transfers.hr/booking?pickup=Zadar+Airport&dropoff=Split+Airport&date=2025-11-18&people=2&transfer_type=oneway
```

### 5ï¸âƒ£ Gotovo! ðŸŽ‰

Forma sada:
- âœ… Ima autocomplete za lokacije
- âœ… Validira podatke
- âœ… Redirecta na tvoju React `/booking` stranicu
- âœ… Sve podatke prosljeÄ‘uje preko URL-a
- âœ… Prikazuje kartu i detalje transfera

---

## ðŸ”§ Customizacija

### Promjena lokacija

Otvori `simple-booking-script.js` i uredi `locations` array:

```javascript
const locations = [
  { name: 'Tvoja Lokacija', city: 'Grad', icon: 'ðŸ“' },
  // Dodaj viÅ¡e lokacija...
];
```

### Promjena boja

U `elementor-simple-booking-form.html` promijeni stilove:

```css
.submit-btn {
  background: #F6C344; /* Tvoja boja */
}

input:focus {
  border-color: #F6C344; /* Tvoja boja */
}
```

### Promjena redirect URL-a

U `elementor-simple-booking-form.html` promijeni:

```html
<form action="https://TVOJA-DOMENA.com/booking">
```

---

## â“ Troubleshooting

### Autocomplete ne radi
- Provjeri da li je JavaScript uÄitan (F12 â†’ Console â†’ nema errora)
- Provjeri da li HTML form ima ID `simple-booking-form`
- Provjeri da li input polja imaju ID-eve `pickup` i `dropoff`

### Forma ne redirecta
- Provjeri `action` URL u HTML formi
- Provjeri da li React app radi na toj domeni
- Provjeri konzolu za JavaScript errore

### Suggestions se ne prikazuju
- Provjeri da li CSS stilovi su uÄitani
- Inspektiraj element i provjeri da li ima `suggestions-dropdown` klasu
- Provjeri da li suggestions dobivaju `active` klasu kada tipkaÅ¡

---

## ðŸ’¡ Prednosti ovog rjeÅ¡enja

âœ… **Nema backend koda** - samo frontend!  
âœ… **Nema baze podataka** - sve preko URL-a  
âœ… **Autocomplete radi odmah** - lista lokacija u JavaScript-u  
âœ… **Jednostavno odrÅ¾avanje** - samo HTML, CSS i JS  
âœ… **Brzo i pouzdano** - nema AJAX poziva, nema errora  
âœ… **SEO friendly** - standardna HTML forma  

---

## ðŸ“ž PodrÅ¡ka

Ako neÅ¡to ne radi, provjeri:
1. Browser konzolu (F12) za JavaScript errore
2. Network tab za blocked requests
3. Da li je forma unutar Elementor HTML widget-a
4. Da li je JavaScript uÄitan u footer-u

