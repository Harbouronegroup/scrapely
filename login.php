<?php
require __DIR__ . '/auth.php';

if (is_logged_in()) {
    header('Location: ./');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = trim((string)($_POST['username'] ?? ''));
    $pass = (string)($_POST['password'] ?? '');
    if (hash_equals(PREVIEW_USER, $user) && password_verify($pass, PREVIEW_HASH)) {
        session_regenerate_id(true);
        $_SESSION['preview_ok'] = true;
        header('Location: ./');
        exit;
    }
    usleep(600000);
    $error = 'That username or password is not right. Please try again.';
}
header('X-Robots-Tag: noindex, nofollow');
?><!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Client Preview · Anchor Digital</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap">
<style>
  :root{--ink:#0F1B2D;--muted:#566173;--line:#D6DBE3;--bg:#F4F6F9;--accent:#123A63;--accent-h:#0B2948;--err:#9B1C1C;--err-bg:#FDECEC}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px;background:var(--bg);color:var(--ink);font-family:'Manrope',system-ui,sans-serif;font-size:16px;line-height:1.5}
  .card{width:100%;max-width:400px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:40px 32px}
  .brand{display:flex;align-items:center;gap:10px;font-weight:700;letter-spacing:.02em;margin-bottom:28px}
  .brand svg{flex:none}
  h1{font-size:24px;margin:0 0 6px;font-weight:700}
  p.sub{margin:0 0 28px;color:var(--muted);font-size:15px}
  label{display:block;font-size:14px;font-weight:600;margin:0 0 6px}
  input{width:100%;font:inherit;padding:12px 14px;min-height:48px;border:1px solid #8C95A3;border-radius:8px;background:#fff;color:var(--ink)}
  input:focus{outline:2px solid var(--accent);outline-offset:1px;border-color:var(--accent)}
  .field{margin-bottom:18px}
  button{width:100%;min-height:50px;margin-top:6px;font:inherit;font-weight:600;color:#fff;background:var(--accent);border:0;border-radius:8px;cursor:pointer}
  button:hover{background:var(--accent-h)}
  .error{background:var(--err-bg);color:var(--err);border-radius:8px;padding:12px 14px;font-size:14px;margin-bottom:20px}
  .foot{margin-top:24px;font-size:13px;color:var(--muted);text-align:center}
</style>
</head>
<body>
<main class="card">
  <div class="brand">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#123A63" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
    <span>Anchor Digital</span>
  </div>
  <h1>Client preview</h1>
  <p class="sub">Sign in to view the Smoke &amp; Taco website preview (option 1).</p>
  <?php if ($error): ?><div class="error" role="alert"><?= htmlspecialchars($error) ?></div><?php endif; ?>
  <form method="post" action="login.php" autocomplete="off">
    <div class="field">
      <label for="username">Username</label>
      <input id="username" name="username" type="text" required autofocus value="<?= htmlspecialchars($_POST['username'] ?? '') ?>">
    </div>
    <div class="field">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" required>
    </div>
    <button type="submit">Sign in</button>
  </form>
  <div class="foot">Private preview · not for public distribution</div>
</main>
</body>
</html>
