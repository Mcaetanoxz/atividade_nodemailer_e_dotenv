require('dotenv').config(); 
const express = require('express');
const fs = require('fs');
const path = require('path');
const juice = require('juice');
const app = express();
const nodemailer = require('nodemailer'); 

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 3000,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});




app.get('/', (req, res) => {
  res.render('index.ejs'); 
});


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  
  res.render('contato'); 
});
  
;
  let transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS  
    },
    tls: {
      rejectUnauthorized: false
    }
     
});



app.post('/enviar-dados', async (req, res) => {
  const { nome, numero, email, assunto, mensagem } = req.body;

  try {
    
    const htmlPuroEmail = `
      <div class="email-container">
        <h2 class="email-titulo">Olá, ${nome}!</h2>
        <p>Obrigado por entrar em contato conosco. Confirmamos o recebimento dos seus dados:</p>
        <table class="email-tabela">
          <tr><td class="celula-titulo">Telefone:</td><td class="celula-conteudo">${numero}</td></tr>
          <tr><td class="celula-titulo">Assunto:</td><td class="celula-conteudo">${assunto}</td></tr>
        </table>
        <div class="caixa-mensagem"><strong>Sua mensagem:</strong><br><em>"${mensagem}"</em></div>
        <p class="email-rodape">Este é um e-mail automático de confirmação. Por favor, não responda.</p>
      </div>
    `;


    const caminhoCssEmail = path.join(__dirname, 'public', 'css', 'email.txt');
    
    let htmlFinalComEstilo = htmlPuroEmail;
    if (fs.existsSync(caminhoCssEmail)) {
      const codigoCssEmail = fs.readFileSync(caminhoCssEmail, 'utf8');
      htmlFinalComEstilo = juice.inlineContent(htmlPuroEmail, codigoCssEmail);
    }


    await transporter.sendMail({
      from: `"Suporte Sistema" <${process.env.EMAIL_USER}>`, 
      to: email, 
      subject: `Confirmação: ${assunto}`, 
      html: htmlFinalComEstilo,
    });

    res.send("<h1>Sucesso! O formulário foi enviado e o e-mail de confirmação foi despachado.</h1>");

  } catch (error) {
    console.error("❌ Erro ao enviar:", error.message);
    res.status(500).send(`Erro ao tentar enviar o e-mail: ${error.message}`);
  }
});


const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`http://localhost:${PORTA}`);
});