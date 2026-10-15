<?php
define('PREVIEW_USER', 'Anchor');
define('PREVIEW_HASH', '$2y$10$sP82NZTAlc6wYtlyla8HoOlFhXh6rh3SJ8NwDlmvUAZMrmg83zn8y');
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name('st_preview');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
    session_start();
}
function is_logged_in() { return !empty($_SESSION['preview_ok']); }
