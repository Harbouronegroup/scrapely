<?php
/* Pureview Exteriors quote form handler. Works on standard PHP hosting (for example Hostinger). */
header('Content-Type: application/json');

$to = 'Pureview.exteriors@outlook.com';

function out($ok, $code = 200) { http_response_code($code); echo json_encode(array('ok' => $ok)); exit; }
function clean($key, $max = 2000) {
    $v = isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
    $v = str_replace(array("\r", "\0"), '', $v);
    return mb_substr($v, 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(false, 405);
if (clean('website') !== '') out(true); /* honeypot: pretend success for bots */

$name = str_replace("\n", ' ', clean('name', 120));
$phone = str_replace("\n", ' ', clean('phone', 40));
$email = str_replace("\n", ' ', clean('email', 160));
$address = clean('address', 300);
$service = str_replace("\n", ' ', clean('service', 60));
$contact = str_replace("\n", ' ', clean('contact_method', 20));
$message = clean('message', 4000);

if ($name === '' || $phone === '') out(false, 422);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) out(false, 422);

$body = "New quote request from the website\n\n"
    . "Name: $name\nPhone: $phone\nEmail: $email\nProperty address: $address\n"
    . "Service required: $service\nPreferred contact method: $contact\n\nMessage:\n$message\n";

$boundary = 'pv' . bin2hex(random_bytes(12));
$host = preg_replace('/[^a-z0-9.\-]/i', '', isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'localhost');
$host = preg_replace('/^www\./i', '', $host);

$headers = "From: Pureview Exteriors Website <no-reply@$host>\r\n";
if ($email !== '') $headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

$mail = "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n$body\r\n";

$allowed = array('image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/heic' => 'heic', 'image/heif' => 'heif');
if (!empty($_FILES['photos']) && is_array($_FILES['photos']['name'])) {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $count = min(5, count($_FILES['photos']['name']));
    for ($i = 0; $i < $count; $i++) {
        if ($_FILES['photos']['error'][$i] !== UPLOAD_ERR_OK) continue;
        if ($_FILES['photos']['size'][$i] > 8 * 1024 * 1024) continue;
        $tmp = $_FILES['photos']['tmp_name'][$i];
        if (!is_uploaded_file($tmp)) continue;
        $type = $finfo->file($tmp);
        if (!isset($allowed[$type])) continue;
        $fname = 'photo-' . ($i + 1) . '.' . $allowed[$type];
        $mail .= "--$boundary\r\nContent-Type: $type; name=\"$fname\"\r\n"
            . "Content-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"$fname\"\r\n\r\n"
            . chunk_split(base64_encode(file_get_contents($tmp))) . "\r\n";
    }
}
$mail .= "--$boundary--\r\n";

$sent = mail($to, "Website quote request: $service", $mail, $headers);
out($sent, $sent ? 200 : 500);
