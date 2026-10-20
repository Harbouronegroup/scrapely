<?php
// Client preview login. Change the password by replacing PASS_HASH with the output of:
//   php -r 'echo password_hash("NewPassword", PASSWORD_DEFAULT);'
const PREVIEW_USER = 'Anchor';
const PASS_HASH = '$2y$10$hFU4YrBtD9sWwTn4EpWBTOVNGyD2jnjbXljUhUDpfkqLMN98ND1nC';

function preview_session(): void {
  if (session_status() === PHP_SESSION_ACTIVE) return;
  session_name('whispa_preview');
  session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => !empty($_SERVER['HTTPS']), 'httponly' => true, 'samesite' => 'Lax']);
  session_start();
}
function preview_logged_in(): bool { preview_session(); return !empty($_SESSION['preview_ok']); }
