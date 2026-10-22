var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
 
router.get("/", function (req, res) {
  res.render("pages/index", {
    resultado: null,
    listaErros: null,
    campos: { nome: "", email: "", telefone: "", assunto: "", mensagem: "" }
  });
});
 
router.post(
  "/index",
  body("nome").notEmpty().withMessage('O nome é obrigatório!'),
  body("email").isEmail().withMessage('O e-mail deve ser válido!'),
  body("telefone").notEmpty().withMessage('O telefone é obrigatório!'),
  body("assunto").notEmpty().withMessage('O assunto é obrigatório!'),
  body("mensagem").notEmpty().withMessage('A mensagem é obrigatória!'),
 
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("pages/index", {
        resultado: null,
        listaErros: errors,
        campos: req.body
      });
    }
 
    const { nome, email, telefone, assunto, mensagem } = req.body;
 
    try {
      
      let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
 
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, 
        subject: `Novo Contato do Site: ${assunto}`,
        text: `Você recebeu uma nova mensagem:\n\nNome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}\nAssunto: ${assunto}\nMensagem: ${mensagem}`
      };
 
      await transporter.sendMail(mailOptions);
      console.log("E-mail enviado com sucesso!");
 
      return res.render("pages/index", {
        resultado: req.body,
        listaErros: null,
        campos: req.body
      });
 
    } catch (error) {
      console.log("Erro detalhado ao enviar e-mail: ", error);
     
      const erroCustomizado = {
        array: () => [{ msg: "Erro ao enviar o e-mail. Verifique suas credenciais no arquivo .env." }]
      };
 
      return res.render("pages/index", {
        resultado: null,
        listaErros: erroCustomizado,
        campos: req.body
      });
    }
  }
);
 
module.exports = router;