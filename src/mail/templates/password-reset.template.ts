import { wrapTemplate, ctaButton, userBadge } from './base.template';

export interface PasswordResetTemplateVars {
  nickname: string;
  email: string;
  resetLink: string;
}

export function passwordResetTemplate({ nickname, email, resetLink }: PasswordResetTemplateVars): string {
  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#e5e7eb;">
      Restablecer contraseña
    </h1>
    <p style="margin:0;font-size:14px;color:#9ca3af;">Recibimos una solicitud para tu cuenta.</p>

    <p style="margin:24px 0 0;font-size:15px;color:#e5e7eb;line-height:1.6;">
      Hola <strong style="color:#7c3aed;">@${nickname}</strong>, recibimos una solicitud para
      restablecer la contraseña de tu cuenta en Ricoll. Haz clic en el botón de abajo para crear
      una nueva contraseña.
    </p>

    ${ctaButton('Restablecer contraseña', resetLink)}

    <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">
      O copia este enlace en tu navegador:<br />
      <span style="color:#7c3aed;word-break:break-all;">${resetLink}</span>
    </p>

    ${userBadge(nickname, email)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border-top:1px solid #2d2d4e;">
      <tr>
        <td style="padding-top:20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#1f1a0e;border:1px solid #78350f;border-radius:8px;">
            <tr>
              <td style="padding:14px 18px;">
                <p style="margin:0;font-size:13px;color:#fbbf24;">
                  ⚠️ Este enlace es válido durante <strong>24 horas</strong>.
                  Si no solicitaste este cambio, ignora este mensaje — tu contraseña no se modificará.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return wrapTemplate(content);
}
