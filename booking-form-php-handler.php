<?php
/**
 * WordPress Booking Form Handler
 * 
 * Kopiraj ovaj kod u functions.php tvoje WordPress teme
 * ili napravi custom plugin
 */

// 1. AJAX Handler za booking formu
add_action('wp_ajax_handle_booking_form', 'handle_booking_form_submission');
add_action('wp_ajax_nopriv_handle_booking_form', 'handle_booking_form_submission');

function handle_booking_form_submission() {
    // Security check - verify nonce
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'booking_form_nonce')) {
        wp_send_json_error([
            'message' => 'Security check failed'
        ]);
    }
    
    // Sanitize input data
    $pickup = sanitize_text_field($_POST['pickup']);
    $dropoff = sanitize_text_field($_POST['dropoff']);
    $date = sanitize_text_field($_POST['date']);
    $people = intval($_POST['people']);
    $transfer_type = sanitize_text_field($_POST['transfer_type']);
    
    // Validate required fields
    if (empty($pickup) || empty($dropoff) || empty($date)) {
        wp_send_json_error([
            'message' => 'All fields are required'
        ]);
    }
    
    // Validate date format
    $date_obj = DateTime::createFromFormat('Y-m-d', $date);
    if (!$date_obj || $date_obj->format('Y-m-d') !== $date) {
        wp_send_json_error([
            'message' => 'Invalid date format'
        ]);
    }
    
    // Validate people count
    if ($people < 1 || $people > 50) {
        wp_send_json_error([
            'message' => 'Number of people must be between 1 and 50'
        ]);
    }
    
    // Save to database (optional)
    save_booking_to_database($pickup, $dropoff, $date, $people, $transfer_type);
    
    // Send email notification
    $email_sent = send_booking_email($pickup, $dropoff, $date, $people, $transfer_type);
    
    if ($email_sent) {
        wp_send_json_success([
            'message' => 'Booking request received successfully!'
        ]);
    } else {
        wp_send_json_error([
            'message' => 'Failed to send email. Please try again.'
        ]);
    }
}

// 2. Save booking to database
function save_booking_to_database($pickup, $dropoff, $date, $people, $transfer_type) {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'transfer_bookings';
    
    // Create table if doesn't exist
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        pickup varchar(255) NOT NULL,
        dropoff varchar(255) NOT NULL,
        date date NOT NULL,
        people int(11) NOT NULL,
        transfer_type varchar(50) NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
    
    // Insert booking
    $wpdb->insert(
        $table_name,
        [
            'pickup' => $pickup,
            'dropoff' => $dropoff,
            'date' => $date,
            'people' => $people,
            'transfer_type' => $transfer_type
        ],
        ['%s', '%s', '%s', '%d', '%s']
    );
    
    return $wpdb->insert_id;
}

// 3. Send email notification
function send_booking_email($pickup, $dropoff, $date, $people, $transfer_type) {
    $admin_email = get_option('admin_email'); // ili 'info@zadar-transfers.hr'
    
    $subject = 'Nova Rezervacija Transfera - Zadar Transfers';
    
    $message = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #F6C344; padding: 20px; text-align: center; color: #111; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { color: #111; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Nova Rezervacija Transfera</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>ðŸ“ PolaziÅ¡te:</span>
                    <span class='value'>{$pickup}</span>
                </div>
                <div class='field'>
                    <span class='label'>ðŸŽ¯ OdrediÅ¡te:</span>
                    <span class='value'>{$dropoff}</span>
                </div>
                <div class='field'>
                    <span class='label'>ðŸ“… Datum:</span>
                    <span class='value'>{$date}</span>
                </div>
                <div class='field'>
                    <span class='label'>ðŸ‘¥ Broj putnika:</span>
                    <span class='value'>{$people}</span>
                </div>
                <div class='field'>
                    <span class='label'>ðŸ”„ Tip transfera:</span>
                    <span class='value'>" . ($transfer_type === 'return' ? 'S povratkom' : 'Jedan smjer') . "</span>
                </div>
                <hr>
                <p><small>Vrijeme zaprimanja: " . current_time('d.m.Y H:i') . "</small></p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Zadar Transfers <noreply@zadar-transfers.hr>'
    ];
    
    return wp_mail($admin_email, $subject, $message, $headers);
}

// 4. Enqueue scripts and localize data
add_action('wp_enqueue_scripts', 'enqueue_booking_form_scripts');

function enqueue_booking_form_scripts() {
    // Enqueue your JavaScript file
    wp_enqueue_script(
        'booking-form-script',
        get_template_directory_uri() . '/js/booking-form-script.js',
        ['jquery'],
        '1.0.0',
        true
    );
    
    // Pass WordPress data to JavaScript
    wp_localize_script('booking-form-script', 'bookingFormData', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('booking_form_nonce')
    ]);
}

// 5. Shortcode za ubacivanje forme u Elementor
add_shortcode('Zadar_booking_form', 'render_booking_form_shortcode');

function render_booking_form_shortcode() {
    ob_start();
    include get_template_directory() . '/booking-form-template.php';
    return ob_get_clean();
}

?>

