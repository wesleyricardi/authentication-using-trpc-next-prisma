import sendByNodemailer from "./nodemailer";

export default async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html: string
) {
  await sendByNodemailer(to, subject, text, html);
}
