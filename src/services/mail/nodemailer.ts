import nodemailer from "nodemailer";

const sendByNodemailer = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  if (
    !process.env.SMTP_MAIL ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_SECURE ||
    !process.env.USER_MAIL ||
    !process.env.USER_PASS ||
    !process.env.USERNAME_MAIL
  )
    throw new Error(
      "SMTP_MAIL, SMTP_PORT, SMTP_SECURE, USER_MAIL, USER_PASS, USERNAME_MAIL not defined"
    );

  const host = process.env.SMTP_MAIL;
  const port = Number(process.env.SMTP_PORT);
  const secure = Boolean(process.env.SMTP_SECURE); // true for 465, false for other port
  const userEmail = process.env.USER_MAIL;
  const pass = process.env.USER_PASS;
  const userName = process.env.USERNAME_MAIL;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: userEmail,
        pass,
      },
    });

    await transporter.sendMail({
      from: `"${userName}" <${userEmail}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error: any) {
    return error;
  }
};

export default sendByNodemailer;
