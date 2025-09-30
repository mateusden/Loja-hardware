const Product = require('../model/Product');


async function addProduct(productData) {

    try{
        console.log(productData + "Chegou na Service")
        const product = await Product.create(productData);
        return product
    }catch{
        throw new Error("Erro ao adicionar produto");
        
    }
}
module.exports = {
    addProduct
}