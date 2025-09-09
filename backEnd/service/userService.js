const User = require('../model/User');
const Sessao = require('../model/Sessao');

const createUser = async (user) => {
    const newUser = await User.create(user);
    return newUser;
};

const updateUser = async (user) => {
    const updatedUser = await User.update(user);
    return updatedUser;
};

const deleteUser = async (user) => {
    const deletedUser = await User.destroy({ where: { id: user.id } });
    return deletedUser;
};

const login = async (email) => {
    const loggedUser = await User.findOne({ where: { email: email} });

    console.log(loggedUser);
    
    if (!loggedUser) {
        throw new Error("Usuário ou senha incorretos");
    }

    return loggedUser;
};

const logout = async (token) => {
   
    await Sessao.destroy({ where: { token } });
    
   return "Logout realizado com sucesso";
};

const registerUser = async (user) => {
    console.log(user);
    const registeredUser = await User.create(user);
    return registeredUser;
};

const getUser = async (user) => {
    const loggedUser = await User.findOne({ where: { email: user.email } });
    return loggedUser;
};

module.exports = { createUser, updateUser, deleteUser, login, logout, registerUser, getUser };