const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cpf: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: true,
        validate: {
            len: [14, 14] // Garante que tem exatamente 11 caracteres
        }
    }
}, {
    timestamps: true,
    tableName: 'user' // Opcional: define um nome explícito para a tabela
});

// Sincronização melhorada (normalmente feito em um arquivo separado)
async function syncModel() {
    try {
        // Use force: true apenas em desenvolvimento para recriar a tabela
        // await User.sync({ force: true });
        await User.sync({ alter: true }); // Alteração segura da estrutura
        console.log('Tabela User sincronizada com sucesso!');
    } catch (error) {
        console.error('Erro ao sincronizar tabela User:', error);
    }
}

// Chame a função de sincronização (opcional)
// syncModel();

module.exports = User;