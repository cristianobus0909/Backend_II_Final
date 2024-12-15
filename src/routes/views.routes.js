import { Router } from "express";
import ProductServices from "../services/dao/db/products.services.js";
import { passportCall, autorization } from "../utils.js";

const router = Router()
const productServices = new ProductServices();

router.get('/', async (req, res)=>{
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const products = await productServices.getAll({}, { page, limit, lean: true });
    // products = await productModel.aggregate([
    //     { $group: { _id: "$category", total: { $sum: "$price" }}},
    //     { $sort: { totalQuantity: -1}}
    // ])
    
    res.render('home',{
        title: 'Backend | Handlebars',
        products: products,
        user: req.session.user
    });
})

router.get('/realtimeproducts',passportCall('jwt',{session:false}),autorization("admin"), async (req, res) => {
    try {
        const products = await productServices.getAll(); 
        res.render('realTimeProducts', { products, user: req.session.user });
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
        const newProduct =  await productServices.create(title,description,price,category,thumbnails,status,code,stock);
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
        const deleteProductById = await productServices.delete(productId)
        
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
router.get('/products',async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const products = await productServices.getAll({}, { page, limit, lean: true });
    res.render('products', {
        user: req.session.user,
        products: products,
        pagination: {
            totalPages: products.totalPages,
            currentPage: products.page,
            hasNextPage: products.hasNextPage,
            hasPrevPage: products.hasPrevPage,
            nextPage: products.nextPage,
            prevPage: products.prevPage
        }
    });
});

router.get('/products/:pid', passportCall('jwt',{session:false}),autorization("user"),async (req, res) => {
    try {
        console.log(req.params.pid);
        console.log(req.session.user);
        const product = await productServices.getById({_id:req.params.pid});
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('productDetail', { 
            product:product, 
            user: req.session.user 
        });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error interno del servidor');
    }
})
router.get('/carts', (req, res)=>{
    res.render('cart',{})
})
export  default router;