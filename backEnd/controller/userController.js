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

    const user = await userService.getUser(req.body);


    if (user != null) {
      console.log("deu erro");
      return res.status(400).json({ error: "Usuario ja cadastrado" });

    }
    else {
      console.log("deu certo");
      var hash = await bcrypt.hash(req.body.password, 10);
      req.body.password = hash;
      const newuser = await userService.registerUser(req.body);
      res.status(200).json(newuser);
    }

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);

    await Sessao.update(
      { invalido: true },
      { where: { usuarioid: user.id, invalido: false } }
    );

    if(bcrypt.compareSync(password, user.password)){
      user.senha = null;
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const expiracao = moment().tz('America/Sao_Paulo').add(1, 'hour').toDate();
      await Sessao.create({ usuarioid: user.id, token, expiracao, invalido: false });
      return res.status(200).json({ user, token });
    }
    else{
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    

   
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}
const logout = async (req, res) => {
  try {
    const user = await userService.logout(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
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