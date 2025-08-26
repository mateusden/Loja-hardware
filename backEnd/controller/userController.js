const userService = require("../service/userService");

const createUser = async (req, res) => {

    try{
        const user = await userService.createUser(req.body);
        res.status(201).json(user);

    }catch(error){
        res.status(400).json({error: error.message});
    }


   
};
const registerUser = async (req, res) => {
    try {
            console.log(req.body);
            
            const user = await userService.getUser(req.body);
            

            if(user != null){
                return res.status(400).json({ error: "Usuario ja cadastrado" });
                
            } 
            else{
                const newuser = await userService.registerUser(req.body);
                 res.status(200).json(newuser);
            }
            
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
 const login = async (req, res) => {
    try {
      const user = await userService.login(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
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
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
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