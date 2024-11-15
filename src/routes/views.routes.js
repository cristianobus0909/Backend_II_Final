import { Router } from "express";
import productModel from "../services/dao/db/models/products.models.js";

const router = Router()

router.get('/', async (req, res)=>{
    let products = await productModel.find()
    products = await productModel.aggregate([
        { $group: { _id: "$category", total: { $sum: "$price" }}},
        // { $sort: { totalQuantity: -1}}
    ])
    
    res.render('home',{
        title: 'Backend | Handlebars',
        products: products
    });
})

router.get('/realtimeproducts', (req, res)=>{
    const products = productModel.find()
    res.render('realTimeProducts',{products})
})
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
router.get('/cart', (req, res)=>{
    res.render('cart',{})
})
export  default router;