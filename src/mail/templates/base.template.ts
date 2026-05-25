const PURPLE = '#7c3aed';
const PURPLE_DARK = '#5b21b6';
const BG = '#0f0f0f';
const CARD_BG = '#1a1a2e';
const BORDER = '#2d2d4e';
const TEXT = '#e5e7eb';
const MUTED = '#9ca3af';

export function wrapTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ricoll</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="font-size:28px;font-weight:800;color:${PURPLE};letter-spacing:2px;">RICOLL</span>
              <p style="margin:4px 0 0;font-size:12px;color:${MUTED};letter-spacing:3px;text-transform:uppercase;">Card Manager</p>
            </td>
          </tr>

          <!-- CARD -->
          <tr>
            <td style="background-color:${CARD_BG};border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">

              <!-- TOP ACCENT -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg,${PURPLE},${PURPLE_DARK});"></td>
                </tr>
              </table>

              <!-- CONTENT -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:36px 40px;">
                    ${content}
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:11px;color:${MUTED};">
                Este mensaje fue generado automáticamente. Por favor, no respondas a este correo.
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:${MUTED};">
                © 2026 Ricoll — TFG · Riftbound Card Manager
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function ctaButton(label: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin-top:24px;">
    <tr>
      <td style="background-color:${PURPLE};border-radius:8px;">
        <a href="${href}"
           style="display:inline-block;padding:14px 32px;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;letter-spacing:0.5px;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`;
}

export function userBadge(nickname: string, email: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:#0f0f1a;border:1px solid #2d2d4e;border-radius:8px;">
    <tr>
      <td style="padding:16px 20px;">
        <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Tu cuenta</p>
        <p style="margin:6px 0 0;font-size:16px;font-weight:700;color:#e5e7eb;">@${nickname}</p>
        <p style="margin:2px 0 0;font-size:13px;color:#9ca3af;">${email}</p>
      </td>
    </tr>
  </table>`;
}
