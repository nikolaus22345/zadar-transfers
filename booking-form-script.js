// Booking Form JavaScript with Autocomplete

// Lista lokacija za autocomplete
const locations = [
    { name: "Zadar Airport (ZAD)", type: "airport", city: "Zadar" },
    { name: "Zadar Bus Station (Autobusni Kolodvor)", type: "bus", city: "Zadar" },
    { name: "Zadar Central Station (Glavni Kolodvor)", type: "train", city: "Zadar" },
    { name: "Zadar City Center", type: "city", city: "Zadar" },
    { name: "Split Airport (SPU)", type: "airport", city: "Split" },
    { name: "Split City Center", type: "city", city: "Split" },
    { name: "Dubrovnik Airport (DBV)", type: "airport", city: "Dubrovnik" },
    { name: "Dubrovnik City Center", type: "city", city: "Dubrovnik" },
    { name: "Pula Airport (PUY)", type: "airport", city: "Pula" },
    { name: "Pula City Center", type: "city", city: "Pula" },
    { name: "Rijeka City Center", type: "city", city: "Rijeka" },
    { name: "Plitvice Lakes National Park", type: "attraction", city: "Plitvice" },
    { name: "Ljubljana, Slovenia", type: "city", city: "Ljubljana" },
    { name: "Lake Bled, Slovenia", type: "attraction", city: "Bled" },
    { name: "Vienna, Austria", type: "city", city: "Vienna" },
    { name: "Budapest, Hungary", type: "city", city: "Budapest" }
];

// Get icon for location type
function getLocationIcon(type) {
    switch (type) {
        case 'airport':
            return 'âœˆï¸';
        case 'bus':
        case 'train':
            return 'ðŸš‰';
        case 'attraction':
            return 'ðŸžï¸';
        default:
            return 'ðŸ“';
    }
}

// Filter locations based on input
function filterLocations(input) {
    if (!input || input.length < 2) return [];
    const searchTerm = input.toLowerCase();
    return locations.filter(loc => 
        loc.name.toLowerCase().includes(searchTerm) ||
        loc.city.toLowerCase().includes(searchTerm)
    );
}

// Show suggestions
function showSuggestions(input, suggestionsElement) {
    const filtered = filterLocations(input);
    
    if (filtered.length === 0) {
        suggestionsElement.classList.remove('active');
        return;
    }
    
    let html = '';
    filtered.forEach(location => {
        html += `
            <div class="suggestion-item" data-name="${location.name}">
                <span class="suggestion-icon">${getLocationIcon(location.type)}</span>
                <div class="suggestion-content">
                    <div class="suggestion-name">${location.name}</div>
                    <div class="suggestion-city">${location.city}</div>
                </div>
            </div>
        `;
    });
    
    suggestionsElement.innerHTML = html;
    suggestionsElement.classList.add('active');
    
    // Add click handlers
    const items = suggestionsElement.querySelectorAll('.suggestion-item');
    items.forEach(item => {
        item.addEventListener('click', function() {
            const inputElement = suggestionsElement.previousElementSibling;
            inputElement.value = this.getAttribute('data-name');
            suggestionsElement.classList.remove('active');
        });
    });
}

// Initialize autocomplete
function initAutocomplete() {
    const pickupInput = document.getElementById('pickup');
    const dropoffInput = document.getElementById('dropoff');
    const pickupSuggestions = document.getElementById('pickup-suggestions');
    const dropoffSuggestions = document.getElementById('dropoff-suggestions');
    
    // Pickup input
    pickupInput.addEventListener('input', function() {
        showSuggestions(this.value, pickupSuggestions);
    });
    
    pickupInput.addEventListener('focus', function() {
        if (this.value.length >= 2) {
            showSuggestions(this.value, pickupSuggestions);
        }
    });
    
    // Dropoff input
    dropoffInput.addEventListener('input', function() {
        showSuggestions(this.value, dropoffSuggestions);
    });
    
    dropoffInput.addEventListener('focus', function() {
        if (this.value.length >= 2) {
            showSuggestions(this.value, dropoffSuggestions);
        }
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.input-wrapper')) {
            pickupSuggestions.classList.remove('active');
            dropoffSuggestions.classList.remove('active');
        }
    });
}

// Set minimum date to today
function setMinDate() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Show message
function showMessage(message, type) {
    const messageEl = document.getElementById('form-message');
    messageEl.textContent = message;
    messageEl.className = `form-message ${type}`;
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Client-side validation
    if (!data.pickup.trim()) {
        showMessage('Please enter pickup location', 'error');
        return;
    }
    
    if (!data.dropoff.trim()) {
        showMessage('Please enter drop-off location', 'error');
        return;
    }
    
    if (!data.date) {
        showMessage('Please select a date', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING...';
    
    // AJAX request to WordPress
    fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'handle_booking_form',
            nonce: bookingFormData.nonce, // WordPress nonce for security
            ...data
        })
    })
    .then(response => response.json())
    .then(result => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'SEARCH';
        
        if (result.success) {
            showMessage('Booking request sent successfully! We will contact you soon.', 'success');
            e.target.reset();
        } else {
            showMessage(result.data.message || 'Something went wrong. Please try again.', 'error');
        }
    })
    .catch(error => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'SEARCH';
        showMessage('Network error. Please check your connection.', 'error');
        console.error('Error:', error);
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initAutocomplete();
    setMinDate();
    
    const form = document.getElementById('booking-form');
    form.addEventListener('submit', handleFormSubmit);
});

