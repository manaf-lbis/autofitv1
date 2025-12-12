export const autofitOtpTemplate = (otp: string, username?: string) => `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      background-color: #f6f9fc;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
    }

    .email-container {
      max-width: 500px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
      padding: 30px;
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
      font-size: 28px;
      font-weight: bold;
      color: #0057d9;
    }

    .otp-box {
      font-size: 24px;
      font-weight: bold;
      background-color: #f0f4ff;
      color: #0057d9;
      padding: 15px;
      text-align: center;
      border-radius: 6px;
      letter-spacing: 5px;
      margin: 20px 0;
    }

    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
      text-align: center;
    }

    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #0057d9;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="logo">Autofit</div>

    <p>Hello ${username || "there"},</p>
    <p>We received a request to verify your email address. Please use the OTP below to continue:</p>

    <div class="otp-box">${otp}</div>

    <p>This OTP is valid for the next <strong>10 minutes</strong>. Do not share it with anyone.</p>

    <p>If you didn’t request this, you can safely ignore this email.</p>

    <div class="footer">
      <p>Need help? Contact <a href="mailto:support@autofit.com">support@autofit.com</a></p>
    </div>
  </div>
</body>

</html>`;
