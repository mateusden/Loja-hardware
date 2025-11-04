const express = require("express");
const userRoutes = express.Router();
const userController = require("../controller/userController");

userRoutes.post("/register", userController.registerUser);

userRoutes.post("/logout", userController.logout);

userRoutes.get("/", (req, res) => {
  res.send(` 

    <div style="display: flex;justify-content: center;align-items: center;height: 100vh">

      <h1 style="font-size: 50px; text-align: center">Bem vindo ao Servidor da Loja de Hardware</h1>

+
    </div>
    `);
});

userRoutes.delete("/delete", userController.deleteUser);

userRoutes.post("/login", userController.login);

userRoutes.get("/allusers", userController.getallUsers);

userRoutes.put("/update", userController.updateUserController);

userRoutes.get("/seek", userController.seekUserByCpf);

userRoutes.get("/search", userController.searchUserByFeatName);


module.exports = userRoutes;
