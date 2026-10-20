<?php
require __DIR__ . '/auth.php';
preview_session();
header('X-Robots-Tag: noindex, nofollow');
header('X-Frame-Options: DENY');

$next = (string)($_GET['next'] ?? $_POST['next'] ?? '/');
if ($next === '' || $next[0] !== '/' || str_starts_with($next, '//')) $next = '/';
if (preview_logged_in() && $_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . $next, true, 302); exit; }
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $user = trim((string)($_POST['username'] ?? ''));
  $pass = (string)($_POST['password'] ?? '');
  $okToken = hash_equals($_SESSION['csrf'], (string)($_POST['csrf'] ?? ''));
  if ($okToken && hash_equals(strtolower(PREVIEW_USER), strtolower($user)) && password_verify($pass, PASS_HASH)) {
    session_regenerate_id(true);
    $_SESSION['preview_ok'] = true;
    header('Location: ' . $next, true, 303);
    exit;
  }
  usleep(800000);
  $error = 'That username or password is not right. Please check and try again.';
}
$h = fn($s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
?><!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Whispa Website Preview | Anchor Digital Solutions</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#192F3D">
<link rel="icon" type="image/png" href="/login-assets/favicon-32.png">
<link rel="apple-touch-icon" href="/login-assets/apple-touch-icon.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Manrope:wght@400;600&display=swap">
<style>
:root { --ivory:#F7F5F0; --white:#FFFFFF; --ink:#202320; --ink-2:#4E534C; --blue:#192F3D; --blue-2:#122430; --sage:#A7B0A0; --stone:#DCD6CB; --champagne:#B9A47A; --err:#9B2C2C; color-scheme: light; }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; -webkit-tap-highlight-color: transparent; }
body { margin: 0; min-height: 100vh; min-height: 100dvh; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); background: var(--ivory); color: var(--ink); font-family: "Manrope", "Avenir Next", "Segoe UI", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
.side { background: var(--blue); color: var(--ivory); padding: max(48px, env(safe-area-inset-top)) max(48px, env(safe-area-inset-right)) 48px max(48px, env(safe-area-inset-left)); display: flex; flex-direction: column; justify-content: space-between; gap: 40px; position: relative; overflow: hidden; }
.side::after { content: ""; position: absolute; width: 70vh; height: 70vh; right: -25vh; bottom: -25vh; border-radius: 50%; border: 1px solid rgba(185,164,122,.28); }
.side img { width: 96px; height: 96px; border-radius: 50%; box-shadow: 0 0 0 1px rgba(247,245,240,.2); }
.side h1 { font-family: "Cormorant Garamond", Georgia, serif; font-weight: 400; font-size: clamp(2.6rem, 5vw, 4.6rem); line-height: 1; margin: 0; }
.side h1 em { color: var(--sage); }
.side p { color: var(--stone); max-width: 30em; line-height: 1.7; margin: 0; }
.eyebrow { font-size: .72rem; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; display: flex; align-items: center; gap: .8em; margin: 0; }
.eyebrow::before { content: ""; width: 28px; height: 1px; background: var(--champagne); }
.side .eyebrow { color: var(--sage); }
main { display: grid; place-items: center; padding: 48px max(24px, env(safe-area-inset-right)) max(48px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left)); }
form { width: min(420px, 100%); display: grid; gap: 22px; }
form h2 { font-family: "Cormorant Garamond", Georgia, serif; font-weight: 400; font-size: 2.4rem; line-height: 1.05; margin: 0; }
.intro { color: var(--ink-2); margin: -8px 0 4px; line-height: 1.6; }
label { display: block; font-size: .74rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-2); margin-bottom: 8px; }
input { width: 100%; font: inherit; font-size: max(16px, 1rem); color: var(--ink); background: var(--white); border: 0; border-bottom: 1px solid rgba(32,35,32,.35); border-radius: 0; padding: 14px; min-height: 52px; -webkit-appearance: none; appearance: none; }
input:focus { outline: none; box-shadow: inset 0 -1px 0 var(--blue), 0 0 0 1px var(--blue); }
button { font: inherit; font-size: .82rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; min-height: 54px; border: 0; background: var(--blue); color: var(--ivory); cursor: pointer; touch-action: manipulation; transition: background .3s; }
button:hover { background: var(--ink); }
button:focus-visible { outline: 2px solid var(--blue); outline-offset: 3px; }
.error { border-left: 2px solid var(--err); background: var(--white); padding: 14px 16px; color: var(--err); margin: 0; }
.credit { font-size: .8rem; color: var(--ink-2); margin: 0; }
.credit a { color: inherit; }
@media (max-width: 820px) {
  body { grid-template-columns: minmax(0, 1fr); }
  .side { padding: max(28px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) 36px max(20px, env(safe-area-inset-left)); gap: 24px; }
  .side img { width: 72px; height: 72px; }
  .side .hide-sm { display: none; }
  main { place-items: start center; padding-top: 36px; }
}
</style>
</head>
<body>
<aside class="side">
  <img src="/login-assets/whispa-logo.png" alt="Whispa Cleaning" width="96" height="96">
  <div style="display:grid;gap:20px;position:relative;z-index:1">
    <p class="eyebrow">Website preview</p>
    <h1>Whispa Cleaning, <em>new website.</em></h1>
    <p class="hide-sm">A private preview prepared by Anchor Digital Solutions. Sign in to browse every page of the new site.</p>
  </div>
</aside>
<main>
  <form method="post" action="/login.php" autocomplete="on">
    <h2>Sign in</h2>
    <p class="intro">Enter the username and password you were given.</p>
    <?php if ($error): ?><p class="error" role="alert"><?= $h($error) ?></p><?php endif; ?>
    <div><label for="username">Username</label><input id="username" name="username" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required value="<?= $h($_POST['username'] ?? '') ?>"></div>
    <div><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required></div>
    <input type="hidden" name="csrf" value="<?= $h($_SESSION['csrf']) ?>">
    <input type="hidden" name="next" value="<?= $h($next) ?>">
    <button type="submit">View the website</button>
    <p class="credit">Prepared by <a href="https://www.anchor-digital.co.uk" target="_blank" rel="noopener">Anchor Digital Solutions</a></p>
  </form>
</main>
</body>
</html>
