import { Router } from "express";
import ProductModel from "../services/dao/db/models/products.models.js";
import bodyParser from 'body-parser';

const router = Router();

router.use(bodyParser.json());

router.get("/", async(req,res)=>{
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const products = await ProductModel.paginate({},{page, limit:limit, lean:true});
        res.status(200).send({result: "success", payload:products})
        
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
    
});
router.get("/:pid", async(req,res)=>{
    try {
        const productId = req.params.pid;
        
        const product = await ProductModel.findById(productId);
        if (!product) {
            res.status(404).send("Not found")
        }
        res.status(200).json(product)
    } catch (error) {
        console.error("Producto no encontardo:", error)
        res.status(500).send("Error al obtener el producto")
    }
    
});
router.post('/', async (req, res) => {
    const {
        title,
        description,
        price,
        category,
        status,
        thumbnails,
        code,
        stock
    } = req.body;

    if (!title || !description || !price || !category || !thumbnails || !code || stock === undefined) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        const newProduct = await ProductModel.create({
            title,
            description,
            price,
            category,
            status,
            thumbnails,
            code,
            stock
        });

        res.status(201).json({ message: 'Producto agregado con éxito', product: newProduct });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res)=>{
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    await ProductModel.updateOne(productId, updatedFields);

    res.status(200).json({ message: 'Producto actualizado con éxito' });
});
router.delete('/:pid', async (req, res)=>{
    const productId = parseInt(req.params.pid);
    if (productId) {
        ProductModel.deleteOne(productId);
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } else {
        res.status(400).json({message:"No se encontro el producto a eliminar"})
    }
    
});
export default router;