import express from 'express';
import cors from 'cors'; // 👈 ADICIONE
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors()); // 👈 ATIVE O CORS AQUI
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.post('/api/enviar-email-status', async (req, res) => {
  const { nome, funcao, status } = req.body;

  const tipo = status === 'bloqueado' ? 'Bloqueio' : 'Desbloqueio';
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_DESTINO,
    subject: `⚠️ ${tipo} de ${nome}`,
    text: `Nome: ${nome}\nFunção: ${funcao}\nNovo status: ${status}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩 E-mail de ${tipo} enviado para ${nome}`);
    res.status(200).send({ success: true, message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    res.status(500).send({ success: false, message: 'Erro ao enviar e-mail.' });
  }
});

app.get('/', (req, res) => {
  res.send('API do Controle de Férias está online!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
