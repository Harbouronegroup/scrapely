<?php
require __DIR__ . '/auth.php';
preview_session();
$_SESSION = [];
session_destroy();
header('Location: /login.php', true, 303);
