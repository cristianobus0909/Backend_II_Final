import { Router } from "express";
import productModel from "../services/dao/db/models/products.models.js";
import { passportCall, autorization } from "../utils.js";

const router = Router()

router.get('/', async (req, res)=>{
    let products = await productModel.find().lean();
    // products = await productModel.aggregate([
    //     { $group: { _id: "$category", total: { $sum: "$price" }}},
    //     { $sort: { totalQuantity: -1}}
    // ])
    
    res.render('home',{
        title: 'Backend | Handlebars',
        products: products
    });
})

router.get('/realtimeproducts',passportCall('jwt',{session:false}),autorization("admin"), async (req, res) => {
    try {
        const products = await productModel.find().lean(); 
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});
router.post('/realtimeproducts', async(req, res)=>{
    const {
        title,
        description,
        price,
        category,
        thumbnails,
        code,
        stock
    } = req.body;
    
    const status = true
    try {
        const newProduct =  await productModel.create(title,description,price,category,thumbnails,status,code,stock);
        console.log(newProduct);
        socketServer.emit('productAdded', { product: newProduct });
        
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).send("Error interno del servidor");
    }
    res.redirect('/realtimeproducts');
})
router.delete('/realtimeproducts', async(req, res)=>{
    const productId = req.body.id
    
    try {
        const deleteProductById = await productModel.delete(productId)
        
        socketServer.emit('productDeleted', { message: `Producto  con ID: ${deleteProductById} eliminado` });
        res.status(200).send("Producto eliminado con éxito");
    } catch (error) {
        console.error("Error al eliminar el producto:", error)
        res.status(500).send("Error interno del servidor al eliminar el producto");
    }
    res.redirect('/realtimeproducts');
    
})
router.get('/chat', (req, res)=>{
    res.render('chat',{})
})
router.get('/product', (req, res)=>{
    res.render('product',{})
})
router.get('/product/:pid', (req, res)=>{
    res.render('productDetail',{})
})
router.get('/carts', (req, res)=>{
    res.render('cart',{})
})
export  default router;