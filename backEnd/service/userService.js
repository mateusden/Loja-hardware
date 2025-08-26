const User = require('../model/User');

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
const login = async (user) => {
    const loggedUser = await User.findOne({ where: { email: user.email } });
    return loggedUser;
};
const logout = async (user) => {
    const loggedOutUser = await User.findOne({ where: { email: user.email } });
    return loggedOutUser;
};
const registerUser = async (user) => {
    const registeredUser = await User.create(user);
    return registeredUser;
};
const getUser = async (user) => {
    const loggedUser = await User.findOne({ where: { email: user.email } });
    return loggedUser;
};

module.exports = { createUser, updateUser, deleteUser, login, logout, registerUser, getUser };
