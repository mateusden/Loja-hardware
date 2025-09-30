
const productService = require('../service/productService');



async function addProduct(req, res) {
    
    try{
        
        const result = await productService.addProduct(req.body);
        res.status(200).json(result);
    } catch(error){
        
        console.error("Erro no registro:", error);
        res.status(400).json({ error: error.message });
    }
    
}
module.exports = {
    addProduct 
};