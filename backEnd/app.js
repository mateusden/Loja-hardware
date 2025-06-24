// app.js - CommonJS Version
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Configurações iniciais
const app = express();
const PORT = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

// ======================================
// 1. Middlewares Essenciais
// ======================================
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (env === 'development') {
  app.use(morgan('dev'));
}

// ======================================
// 2. Conexão com o Banco de Dados
// ======================================
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: env === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Testar conexão (usando async/await com IIFE)
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com MySQL estabelecida');
    
    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync({ alter: true });
      console.log('🔄 Modelos sincronizados');
    }
  } catch (error) {
    console.error('❌ Falha na conexão com o banco:', error);
    process.exit(1);
  }
})();

// ======================================
// 3. Configurações de Segurança
// ======================================
app.set('jwtSecret', process.env.JWT_SECRET);
app.set('bcryptSaltRounds', parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);

// Middleware de autenticação
function authenticateJWT(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, app.get('jwtSecret'), (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ======================================
// 4. Rotas Básicas
// ======================================
// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'UP',
    environment: env
  });
});

// Rota de login exemplo
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Exemplo estático (substitua por busca no banco)
  const user = { id: 1, email: 'admin@example.com' };
  const validPassword = await bcrypt.compare(password, await bcrypt.hash('senha123', 10));
  
  if (!validPassword) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { userId: user.id },
    app.get('jwtSecret'),
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// Rota protegida exemplo
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: `Acesso concedido para usuário ${req.user.userId}` });
});

// ======================================
// 5. Manipulação de Erros
// ======================================
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ======================================
// 6. Inicialização do Servidor
// ======================================
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🔧 Ambiente: ${env}`);
});

// Encerramento seguro
process.on('SIGTERM', () => {
  server.close(() => {
    sequelize.close();
    console.log('🛑 Servidor encerrado');
  });
});

// Export para testes
module.exports = { app, sequelize };