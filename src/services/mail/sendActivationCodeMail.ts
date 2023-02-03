import sendMail from "~/services/mail/nodemailer";

export default async function sendActivationCodeMail(
  email: string,
  code: string
) {
  sendMail(
    email,
    "Ativação de conta",
    "Bem vindo(a)! seu codigo de ativação é " + code,
    "<h1>Bem vindo(a)!</h1><p>Seu codigo de ativação é <b>" + code + "</b></p>"
  );
}
