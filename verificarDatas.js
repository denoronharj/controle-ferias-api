import admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const verificarAfastamentosERetornos = async () => {
  const hoje = new Date().toLocaleDateString('pt-BR');

  const snapshot = await db.collection('usuarios').get();

  for (const doc of snapshot.docs) {
    const user = doc.data();

    if (user.afastamento === hoje || user.retorno === hoje) {
      const tipo = user.afastamento === hoje ? 'Afastamento' : 'Retorno';

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_DESTINO,
        subject: `📣 ${tipo} - ${user.nome}`,
        text: '', // força HTML
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px;">
              <div style="text-align: center;">
                <img src="https://controle-ferias-api.onrender.com/logo.png" alt="Logo Silimed" style="max-width: 120px; margin-bottom: 20px;" />
              </div>
              <h2 style="color: #d9534f; text-align: center;">${tipo} de usuário</h2>
              <p style="font-size: 16px;"><strong>Nome:</strong> ${user.nome}</p>
              <p style="font-size: 16px;"><strong>Função:</strong> ${user.funcao}</p>
              <p style="font-size: 16px;"><strong>Data:</strong> <span style="color: #0275d8; font-weight: bold;">${hoje}</span></p>
              <hr style="margin: 20px 0;" />
              <p style="font-size: 14px; color: #888; text-align: center;">
                Este e-mail foi enviado automaticamente pelo sistema de controle de férias.
              </p>
            </div>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`📩 E-mail de ${tipo} enviado para ${user.nome}`);
      } catch (err) {
        console.error(`❌ Falha ao enviar e-mail para ${user.nome}:`, err);
      }
    }
  }
};
