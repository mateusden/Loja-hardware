const userService = require("../service/userService");
const bcrypt = require('bcrypt');
const Sessao = require('../model/Sessao');
const jwt = require('jsonwebtoken');  
const moment = require('moment-timezone');

const createUser = async (req, res) => {

  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};
const registerUser = async (req, res) => {
  try {
    console.log(req.body);

    // Verifica se usuário já existe pelo EMAIL apenas
    const existingUser = await userService.getUser(req.body);

    if (existingUser != null) {
      console.log("Usuário já cadastrado");
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }

    // Hash da senha e criação do usuário
    var hash = await bcrypt.hash(req.body.password, 10);
    req.body.password = hash;
    const newuser = await userService.registerUser(req.body);
    
    res.status(201).json({ 
      success: true, 
      message: "Usuário criado com sucesso",
      user: {
        id: newuser.id,
        name: newuser.name,
        email: newuser.email
      }
    });

  } catch (error) {
    console.error("Erro no registro:", error);
    
    // Tratamento específico para erro de constraint única do Sequelize (apenas email)
    if (error.name === 'SequelizeUniqueConstraintError') {
      // Agora só verifica email, CPF pode se repetir
      if (error.errors[0].path === 'email') {
        return res.status(400).json({ error: 'E-mail já cadastrado' });
      }
    }

    // Outros erros do Sequelize
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    // Erro genérico
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);

    // Invalida sessões anteriores
    await Sessao.destroy({ where: { usuarioid: user.id, invalido: false } });
      

    console.log(user.password);
    console.log(password);

    if (bcrypt.compareSync(password, user.password)) {
      user.senha = null;
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const expiracao = moment().tz('America/Sao_Paulo').add(1, 'hour').toDate();
      await Sessao.create({ usuarioid: user.id, token, expiracao, invalido: false });
      return res.status(200).json({ user, token });
    } else {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
const logout = async (req, res) => {
  try {
    // Extrai o token da requisicao

    const token = req.headers.authorization.split(' ')[1];
    console.log("ção o logout do backend token:" + token);


   
   var resp = await userService.logout(token);

    res.status(200).json(resp);
  } catch (error) {
    // Caso haja um erro, retorna uma resposta com o status 400 e o erro
    res.status(400).json({ error: error.message });
  }
}
/*******  0993f55b-3268-4624-b1d6-f3a41e87ac82  *******/
const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.body);
    return res.status(200).json(user);

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
module.exports = {
  createUser,
  registerUser,
  login,
  logout,
  deleteUser,
  updateUser,
  getUsers
};