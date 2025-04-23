app.post('/api/enviar-email-status', async (req, res) => {
  const { nome, funcao, status } = req.body;

  const tipo = status === 'bloqueado' ? 'Bloqueio' : 'Desbloqueio';
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_DESTINO,
    subject: `⚠️ ${tipo} de ${nome}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px;">
          <div style="text-align: center;">
            <img src="https://i.imgur.com/bC2sYAV.png" alt="Logo Silimed" style="max-width: 120px; margin-bottom: 20px;" />
          </div>
          <h2 style="color: #d9534f; text-align: center;">${tipo} de usuário</h2>
          <p style="font-size: 16px;"><strong>Nome:</strong> ${nome}</p>
          <p style="font-size: 16px;"><strong>Função:</strong> ${funcao}</p>
          <p style="font-size: 16px;">
            <strong>Status:</strong> 
            <span style="color: ${status === 'bloqueado' ? '#d9534f' : '#5cb85c'}; font-weight: bold;">
              ${status.toUpperCase()}
            </span>
          </p>
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
    console.log(`📩 E-mail de ${tipo} enviado para ${nome}`);
    res.status(200).send({ success: true, message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    res.status(500).send({ success: false, message: 'Erro ao enviar e-mail.' });
  }
});