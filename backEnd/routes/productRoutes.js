// routes/productRoutes.js
const Routes = require('express').Router();
const productController = require('../controller/productController');
const { upload, handleMulterError } = require('../config/multer');
const debugMulter  = require('../middlewares/debugMiddleware');

// Rota para adicionar produto COM upload de imagens
Routes.post('/addProduct',  // Verifica se o usuário está autenticado
    (req, res, next) => {
        console.log('=== DEBUG ===', req.files, req.body);
        next()
    },
    upload.fields([
        { name: 'imagem_principal', maxCount: 1 },
        { name: 'imagens_adicionais', maxCount: 5 }
    ]),
    debugMulter,
    (req, res, next) => {
        console.log('=== DEBUG APÓS UPLOAD ===', req.files, req.body);
        next()
    },
    handleMulterError, // Middleware para tratar erros do Multer
    productController.addProduct
);

module.exports = Routes;