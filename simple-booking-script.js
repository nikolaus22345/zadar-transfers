// JEDNOSTAVNI AUTOCOMPLETE SCRIPT ZA WORDPRESS BOOKING FORMU
// Kopiraj ovaj kod u Appearance -> Theme File Editor -> functions.php
// ili koristi Code Snippets plugin

(function() {
  'use strict';

  // Lista popularnih lokacija
  const locations = [
    { name: 'Zadar Airport (ZAD)', city: 'Zadar', icon: 'âœˆï¸' },
    { name: 'Split Airport (SPU)', city: 'Split', icon: 'âœˆï¸' },
    { name: 'Dubrovnik Airport (DBV)', city: 'Dubrovnik', icon: 'âœˆï¸' },
    { name: 'Pula Airport (PUY)', city: 'Pula', icon: 'âœˆï¸' },
    { name: 'Rijeka Airport (RJK)', city: 'Rijeka', icon: 'âœˆï¸' },
    { name: 'Zadar City Center', city: 'Zadar', icon: 'ðŸ™ï¸' },
    { name: 'Zadar Bus Station', city: 'Zadar', icon: 'ðŸšŒ' },
    { name: 'Zadar Train Station', city: 'Zadar', icon: 'ðŸš‚' },
    { name: 'Split City Center', city: 'Split', icon: 'ðŸ™ï¸' },
    { name: 'Dubrovnik Old Town', city: 'Dubrovnik', icon: 'ðŸ°' },
    { name: 'Plitvice Lakes', city: 'Plitvice', icon: 'ðŸžï¸' },
    { name: 'Zadar Old Town', city: 'Zadar', icon: 'ðŸ›ï¸' },
    { name: 'Rovinj', city: 'Istria', icon: 'ðŸ–ï¸' },
    { name: 'PoreÄ', city: 'Istria', icon: 'ðŸ–ï¸' },
    { name: 'Hvar Island', city: 'Hvar', icon: 'ðŸï¸' },
    { name: 'KorÄula Island', city: 'KorÄula', icon: 'ðŸï¸' },
    { name: 'Makarska', city: 'Makarska Riviera', icon: 'ðŸ–ï¸' }
  ];

  // ÄŒekaj da se DOM uÄita
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const form = document.getElementById('simple-booking-form');
    if (!form) return;

    const pickupInput = document.getElementById('pickup');
    const dropoffInput = document.getElementById('dropoff');
    const pickupSuggestions = document.getElementById('pickup-suggestions');
    const dropoffSuggestions = document.getElementById('dropoff-suggestions');

    // Setup autocomplete za pickup
    if (pickupInput && pickupSuggestions) {
      setupAutocomplete(pickupInput, pickupSuggestions);
    }

    // Setup autocomplete za dropoff
    if (dropoffInput && dropoffSuggestions) {
      setupAutocomplete(dropoffInput, dropoffSuggestions);
    }

    // Form validation prije submit-a
    form.addEventListener('submit', function(e) {
      const pickup = pickupInput.value.trim();
      const dropoff = dropoffInput.value.trim();
      const date = document.getElementById('date').value;

      if (!pickup || !dropoff || !date) {
        e.preventDefault();
        alert('Molimo popunite sva obavezna polja!');
        return false;
      }

      // Forma Ä‡e se automatski submitati i redirectati na action URL
      return true;
    });
  }

  function setupAutocomplete(input, suggestionsDiv) {
    // PrikaÅ¾i suggestions dok korisnik tipka
    input.addEventListener('input', function() {
      const value = this.value.toLowerCase().trim();
      
      if (value.length < 2) {
        suggestionsDiv.classList.remove('active');
        return;
      }

      const filtered = locations.filter(loc => 
        loc.name.toLowerCase().includes(value) || 
        loc.city.toLowerCase().includes(value)
      );

      if (filtered.length === 0) {
        suggestionsDiv.classList.remove('active');
        return;
      }

      renderSuggestions(filtered, suggestionsDiv, input);
      suggestionsDiv.classList.add('active');
    });

    // Zatvori suggestions kad klikneÅ¡ izvan
    document.addEventListener('click', function(e) {
      if (!input.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.classList.remove('active');
      }
    });

    // Focus pokazuje sve suggestions
    input.addEventListener('focus', function() {
      if (this.value.trim().length >= 2) {
        suggestionsDiv.classList.add('active');
      }
    });
  }

  function renderSuggestions(locations, container, input) {
    container.innerHTML = locations.map(loc => `
      <div class="suggestion-item" data-name="${loc.name}">
        <span class="suggestion-icon">${loc.icon}</span>
        <div class="suggestion-text">
          <div class="suggestion-name">${loc.name}</div>
          <div class="suggestion-city">${loc.city}</div>
        </div>
      </div>
    `).join('');

    // Dodaj click event za svaki suggestion
    container.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', function() {
        input.value = this.dataset.name;
        container.classList.remove('active');
      });
    });
  }
})();

