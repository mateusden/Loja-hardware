const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sessao = sequelize.define('Sessao', {
    usuarioid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expiracao: {
        type: DataTypes.DATE,
        allowNull: false
    },
    invalido: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    // Opções adicionais do modelo
    tableName: 'sessoes', // Nome da tabela no banco
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Verificar e criar tabela se necessário
Sessao.sync({ force: false })
    .then(() => console.log('✓ Tabela Sessao pronta'))
    .catch(error => console.error('✗ Erro na tabela Sessao:', error));

module.exports = Sessao;