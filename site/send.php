<?php
/* Smoke & Taco enquiry handler.
   Upload with the site. Set $TO to the inbox that should receive enquiries.
   On Hostinger, set $FROM to an address on your own domain so mail is not marked as spam. */
$TO   = 'Smokeandtaco@outlook.com';
$FROM = 'website@anchor-digital.co.uk';
$LOG_DIR = dirname(__DIR__) . '/enquiries';   // outside site/, never served by the gate   // one level above the public folder, so it is not downloadable

header('Content-Type: application/json; charset=utf-8');
function out($ok, $message = '') { echo json_encode(['ok' => $ok, 'message' => $message]); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); out(false, 'Please use the form to send an enquiry.'); }
if (!empty($_POST['website'])) out(true);   // spam trap: pretend success

if (session_status() !== PHP_SESSION_ACTIVE) session_start();
if (!empty($_SESSION['last_send']) && time() - $_SESSION['last_send'] < 30) out(false, 'Please wait a moment before sending another enquiry.');

$forms = [
  'public'  => ['label' => 'Public event enquiry',     'required' => ['name','email','tel','org','type','date','venue','addr','setting','pref']],
  'private' => ['label' => 'Private catering enquiry', 'required' => ['name','email','tel','type','date','guests','addr','setting']],
  'contact' => ['label' => 'General enquiry',          'required' => ['name','email','reason','msg']],
];
$form = $_POST['form'] ?? '';
if (!isset($forms[$form])) out(false, 'Something went wrong with the form. Please email us instead.');

$clean = [];
foreach ($_POST as $k => $v) {
  if (in_array($k, ['form','website'], true) || !is_string($v)) continue;
  $clean[preg_replace('/[^a-z]/', '', $k)] = trim(mb_substr(strip_tags($v), 0, 4000));
}
foreach ($forms[$form]['required'] as $r) { if (($clean[$r] ?? '') === '') out(false, 'Please fill in every required field.'); }
if (!filter_var($clean['email'], FILTER_VALIDATE_EMAIL)) out(false, 'That email address does not look right.');

$subject = $forms[$form]['label'] . ' from ' . preg_replace('/[\r\n]+/', ' ', $clean['name']);
$body = $forms[$form]['label'] . "\nReceived: " . date('j F Y, H:i') . "\nStatus: new\n\n";
foreach ($clean as $k => $v) $body .= ucfirst($k) . ': ' . $v . "\n";

$headers  = 'From: Smoke & Taco website <' . $FROM . ">\r\n";
$headers .= 'Reply-To: ' . $clean['email'] . "\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";
$sent = @mail($TO, $subject, $body, $headers);

if (is_dir($LOG_DIR) || @mkdir($LOG_DIR, 0750, true)) {
  $row = array_merge([date('c'), $form, 'new'], array_values($clean));
  if ($fh = @fopen($LOG_DIR . '/enquiries.csv', 'a')) { fputcsv($fh, $row); fclose($fh); }
}

if (!$sent) out(false, 'We could not send this right now. Please email us at ' . $TO . ' and we will get back to you.');
$_SESSION['last_send'] = time();
out(true);
