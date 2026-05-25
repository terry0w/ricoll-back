import { wrapTemplate, ctaButton, userBadge } from './base.template';

export interface WelcomeTemplateVars {
  nickname: string;
  email: string;
  verifyLink: string;
}

export function welcomeTemplate({ nickname, email, verifyLink }: WelcomeTemplateVars): string {
  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#e5e7eb;">
      Bienvenido a Ricoll, <span style="color:#7c3aed;">@${nickname}</span>
    </h1>
    <p style="margin:0;font-size:14px;color:#9ca3af;">Tu cuenta ha sido creada correctamente.</p>

    <p style="margin:24px 0 0;font-size:15px;color:#e5e7eb;line-height:1.6;">
      Para activar tu cuenta y empezar a gestionar tus cartas de Riftbound,
      verifica tu dirección de correo haciendo clic en el botón de abajo.
    </p>

    ${ctaButton('Verificar cuenta', verifyLink)}

    <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">
      O copia este enlace en tu navegador:<br />
      <span style="color:#7c3aed;word-break:break-all;">${verifyLink}</span>
    </p>

    ${userBadge(nickname, email)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border-top:1px solid #2d2d4e;">
      <tr>
        <td style="padding-top:20px;">
          <p style="margin:0;font-size:13px;color:#9ca3af;">
            Si no has creado esta cuenta, puedes ignorar este mensaje con seguridad.
            Nadie más puede acceder a tu cuenta sin verificar este correo.
          </p>
        </td>
      </tr>
    </table>
  `;

  return wrapTemplate(content);
}
