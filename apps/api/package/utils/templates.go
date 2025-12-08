package utils

import (
	"fmt"
)

func GetVerificationEmailTemplate(otp string) string {
	return fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode Verifikasi Akun</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4F46E5; /* Indigo 600 */
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .otp-box {
            background-color: #EEF2FF; /* Indigo 50 */
            border: 2px dashed #4F46E5;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #4F46E5;
            letter-spacing: 4px;
        }
        .expiry-text {
            font-size: 14px;
            color: #666666;
            margin-top: 10px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AbrizamStore</h1>
        </div>
        <div class="content">
            <div class="greeting">Halo,</div>
            <p>Terima kasih telah mendaftar di AbrizamStore. Untuk mengamankan akun Anda, silakan gunakan kode verifikasi di bawah ini:</p>
            
            <div class="otp-box">
                <div class="otp-code">%s</div>
                <div class="expiry-text">Kode ini berlaku selama 5 menit</div>
            </div>
            
            <p>Jika Anda tidak merasa melakukan permintaan pendaftaran ini, silakan abaikan email ini. Akun Anda tidak akan aktif tanpa verifikasi.</p>
        </div>
        <div class="footer">
            &copy; 2025 AbrizamStore. All rights reserved.
        </div>
    </div>
</body>
</html>
`, otp)
}
