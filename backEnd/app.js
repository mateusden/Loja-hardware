require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const sequelize = require('sequelize');
const e = require('express');


const db = require('./config/database');

db.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(` 

    <div style="display: flex;justify-content: center;align-items: center;height: 100vh">

      <h1 style="font-size: 50px; text-align: center">Bem vindo ao Servidor da Loja de Hardware</h1>


    </div>
    `);
});

app.post('/login', (req, res) => {
  
 var {email, senha} = req.body;
 console.log(email);
 console.log(senha);
 

})

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});





