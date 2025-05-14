import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"BauJobs" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'E-Mail-Adresse bestätigen',
    html: `
      <h1>Willkommen bei BauJobs!</h1>
      <p>Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Link klicken:</p>
      <a href="${verificationUrl}">E-Mail-Adresse bestätigen</a>
      <p>Der Link ist 24 Stunden gültig.</p>
      <p>Falls Sie sich nicht bei BauJobs registriert haben, können Sie diese E-Mail ignorieren.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"BauJobs" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Passwort zurücksetzen',
    html: `
      <h1>Passwort zurücksetzen</h1>
      <p>Sie haben angefordert, Ihr Passwort zurückzusetzen. Klicken Sie auf den folgenden Link, um ein neues Passwort festzulegen:</p>
      <a href="${resetUrl}">Passwort zurücksetzen</a>
      <p>Der Link ist 1 Stunde gültig.</p>
      <p>Falls Sie kein neues Passwort angefordert haben, können Sie diese E-Mail ignorieren.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email: string, vorname: string) => {
  const mailOptions = {
    from: `"BauJobs" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Willkommen bei BauJobs!',
    html: `
      <h1>Willkommen bei BauJobs, ${vorname}!</h1>
      <p>Vielen Dank für Ihre Registrierung bei BauJobs. Wir freuen uns, Sie in unserer Community begrüßen zu dürfen.</p>
      <p>Mit Ihrem Account können Sie:</p>
      <ul>
        <li>Stellenanzeigen veröffentlichen</li>
        <li>Nach Jobs suchen</li>
        <li>Ihr Profil verwalten</li>
      </ul>
      <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
      <p>Ihr BauJobs Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendAccountStatusEmail = async (email: string, status: string, grund?: string) => {
  const mailOptions = {
    from: `"BauJobs" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Änderung Ihres Account-Status',
    html: `
      <h1>Änderung Ihres Account-Status</h1>
      <p>Der Status Ihres BauJobs-Accounts wurde auf "${status}" geändert.</p>
      ${grund ? `<p>Grund: ${grund}</p>` : ''}
      <p>Bei Fragen kontaktieren Sie uns bitte.</p>
      <p>Ihr BauJobs Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
}; 