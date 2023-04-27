const speakeasy = require('speakeasy'); // biblioteca para gerar códigos de autenticação
const qrcode = require('qrcode'); // biblioteca para gerar códigos QR
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// rota para gerar o segredo compartilhado e o código QR
app.post('/auth', (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 }); // gera um segredo compartilhado aleatório
  const token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32'
  }); // gera um código de autenticação baseado no segredo compartilhado
  
    

  // gera o código QR que o usuário irá escanear para configurar o Google Authenticator
  const url = `otpauth://totp/MyApp:${req.body.username}?secret=${secret.base32}&issuer=MyApp`;
  qrcode.toDataURL(url, (err, data_url) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao gerar código QR' });
    }

    qrcode.toFile('./qrcode.png', url, { width: 500 }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('QR code generated with success');
        }
    });

    res.json({ secret: secret.base32, qr_code: data_url });
  });
});

// rota para verificar o código de autenticação fornecido pelo usuário
app.post('/verify', (req, res) => {
  const { secret, token } = req.body;
  const isValidToken = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1
  }); // verifica se o código de autenticação fornecido é válido
  
  if (isValidToken) {
    res.json({ message: 'Valid authentication code' });
  } else {
    res.status(401).json({ message: 'Invalid authentication code' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
