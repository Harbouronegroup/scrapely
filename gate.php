<?php
require __DIR__ . '/auth.php';

if (!is_logged_in()) {
    header('Location: login.php');
    exit;
}
session_write_close();

$base = realpath(__DIR__ . '/site');
$rel  = isset($_GET['f']) ? ltrim((string)$_GET['f'], '/') : '';
if ($rel === '' || substr($rel, -1) === '/') $rel .= 'index.html';
$path = realpath($base . '/' . $rel);
if ($path && is_dir($path)) $path = realpath($path . '/index.html');

if (!$path || strpos($path, $base . DIRECTORY_SEPARATOR) !== 0 || !is_file($path)) {
    http_response_code(404);
    header('Content-Type: text/html; charset=utf-8');
    readfile($base . '/404.html');
    exit;
}

$ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
header('X-Robots-Tag: noindex, nofollow');

// The enquiry form handler runs; no other PHP file is served or run.
if ($ext === 'php') {
    if (basename($path) === 'send.php' && dirname($path) === $base) {
        chdir($base);
        require $path;
        exit;
    }
    http_response_code(404);
    exit;
}

$types = [
    'html' => 'text/html; charset=utf-8', 'css' => 'text/css', 'js' => 'text/javascript',
    'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp',
    'svg' => 'image/svg+xml', 'gif' => 'image/gif', 'ico' => 'image/x-icon',
    'xml' => 'application/xml', 'txt' => 'text/plain; charset=utf-8',
    'mp4' => 'video/mp4', 'webm' => 'video/webm', 'woff2' => 'font/woff2', 'woff' => 'font/woff',
];
header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
header('Cache-Control: private, no-store');
header('Content-Length: ' . filesize($path));
if ($_SERVER['REQUEST_METHOD'] === 'HEAD') exit;
readfile($path);
