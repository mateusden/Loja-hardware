require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const sequelize = require('sequelize');
const e = require('express');
const userRoutes = require('./routes/userRoutes');


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

app.use('/api/users', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});





