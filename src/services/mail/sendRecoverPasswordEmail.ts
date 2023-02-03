import sendMail from "~/services/mail/nodemailer";

export default async function sendRecoverPasswordMail(
  email: string,
  code: string
) {
  sendMail(
    email,
    "Recuperação de senha",
    "Olá, foi solicitado a recuperação de senha para esse e-mail. Se não foi você, ignore esse e-mail. Caso contrário, utilize o código abaixo para recuperar sua senha: " +
      code,
    `<h1>Recuperação de senha</h1>
       <br/>
       <p>Olá!</p>
       <br/>
       <p>Foi solicitado a <b>recuperação de senha</b> para esse e-mail, se não foi você quem solicitou, ignore esse e-mail e continue usando sua senha atual.</p>
       <br/>
       <p>Para trocar sua senha clique nesse <b><a href="<%= URL %>">link</a></b> e coloquei o código abaixo:</p>
       <p>${code}</p>
       <br/>
       <p>Atenciosamente.</p>
       <p><b>Prêmios Top Brasil</b></p>`
  );
}
