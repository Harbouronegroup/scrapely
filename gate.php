<?php
// Serves the Whispa site from ./site only to signed-in preview visitors.
require __DIR__ . '/auth.php';
header('X-Robots-Tag: noindex, nofollow');

$p = (string)($_GET['p'] ?? '');
$p = ltrim(rawurldecode(parse_url('/' . $p, PHP_URL_PATH) ?? ''), '/');

if (!preview_logged_in()) {
  header('Location: /login.php?next=' . rawurlencode('/' . $p), true, 302);
  exit;
}

$root = realpath(__DIR__ . '/site');
$target = realpath($root . '/' . $p);
if ($target && is_dir($target)) {
  if ($p !== '' && substr($p, -1) !== '/') { header('Location: /' . $p . '/', true, 301); exit; }
  $target = realpath($target . '/index.html');
}
if (!$target || strpos($target, $root . DIRECTORY_SEPARATOR) !== 0 || !is_file($target)) {
  http_response_code(404);
  header('Content-Type: text/html; charset=utf-8');
  readfile($root . '/404.html');
  exit;
}

$ext = strtolower(pathinfo($target, PATHINFO_EXTENSION));
if ($ext === 'php') {
  if (basename($target) === 'contact.php') { require $target; exit; }
  http_response_code(404); exit;
}
$types = [
  'html' => 'text/html; charset=utf-8', 'css' => 'text/css; charset=utf-8', 'js' => 'application/javascript; charset=utf-8',
  'png' => 'image/png', 'webp' => 'image/webp', 'jpg' => 'image/jpeg', 'svg' => 'image/svg+xml', 'ico' => 'image/x-icon',
  'webmanifest' => 'application/manifest+json', 'xml' => 'application/xml', 'txt' => 'text/plain; charset=utf-8',
];
header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
header('Cache-Control: ' . ($ext === 'html' ? 'private, no-cache' : 'private, max-age=86400'));
header('Content-Length: ' . filesize($target));
readfile($target);
