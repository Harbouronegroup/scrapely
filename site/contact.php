<?php
// Whispa Cleaning enquiry handler (Hostinger / any PHP host).
// SET THIS before going live: the address enquiries should be delivered to.
const TO_EMAIL = '';                           // e.g. 'elizabeth@whispacleaning.com'
const FROM_EMAIL = 'website@whispacleaning.com'; // must be a mailbox on the site's own domain

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function out(int $code, array $body): void { http_response_code($code); echo json_encode($body); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(405, ['ok' => false, 'error' => 'Method not allowed.']);
if (TO_EMAIL === '') out(503, ['ok' => false, 'error' => 'The enquiry form has not been set up with a delivery address yet.']);
if (!empty($_POST['website'])) out(200, ['ok' => true]); // honeypot: quietly drop bots

$clean = fn($k, $max = 200) => trim(mb_substr(str_replace(["\r", "\n"], ' ', (string)($_POST[$k] ?? '')), 0, $max));
$name = $clean('name');
$email = $clean('email');
$tel = $clean('telephone', 40);
$loc = $clean('location', 120);
$svc = $clean('service', 120);
$msg = trim(mb_substr((string)($_POST['message'] ?? ''), 0, 5000));

$errors = [];
if (mb_strlen($name) < 2) $errors[] = 'name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email address';
if (strlen(preg_replace('/\D/', '', $tel)) < 10) $errors[] = 'telephone number';
if ($errors) out(422, ['ok' => false, 'error' => 'Please check your ' . implode(', ', $errors) . '.']);

$subject = 'Website enquiry from ' . $name;
$body = "New enquiry from whispacleaning.com\n\n"
  . "Name: $name\nEmail: $email\nTelephone: $tel\n"
  . 'Town or postcode: ' . ($loc ?: '-') . "\n"
  . 'Service: ' . ($svc ?: 'Not sure yet') . "\n\n"
  . "Message:\n" . ($msg ?: '-') . "\n";
$headers = [
  'From: Whispa Website <' . FROM_EMAIL . '>',
  'Reply-To: ' . $name . ' <' . $email . '>',
  'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail(TO_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers), '-f' . FROM_EMAIL);
if (!$sent) out(500, ['ok' => false, 'error' => 'Our mail server did not accept the message.']);
out(200, ['ok' => true]);
