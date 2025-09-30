const sequelize = require('../config/database');
const setupAssociations = require('./associations');

// Importar models
const User = require('./User');
const Session = require('./Sessao');
const Product = require('./Product');
const Association = require('./Association');

// Coleção de models
const models = {
    User,
    Session,
    Product,
    Association
};

// Configurar associações
setupAssociations(models);

// Exportar models e sequelize
module.exports = {
    ...models,
    sequelize
};