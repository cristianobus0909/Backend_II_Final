import ProductServices from "../services/dao/db/products.services.js";

const productServices = new ProductServices();

const getProducts = async(req,res)=>{
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const filters = { status: true, category: req.query.category };
        const products = await productServices.getAll(filters,{ page, limit, lean });
        res.status(200).send({result: "success", payload:products})
        
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
    
}

const getProductsById = async(req,res)=>{
    try {
        const productId = req.params.pid;
        
        const product = await productServices.findById(productId);
        if (!product) {
            res.status(404).send("Not found")
        }
        res.status(200).json(product)
    } catch (error) {
        console.error("Producto no encontardo:", error)
        res.status(500).send("Error al obtener el producto")
    }
    
}

const createProducts = async (req, res) => {
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
        const newProduct = {
            title,
            description,
            price,
            category,
            status,
            thumbnails,
            code,
            stock
        };
        await productServices.create(newProduct)
        res.status(201).json({ message: 'Producto agregado con éxito', product: newProduct });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: error.message });
    }
}

const updateProduct = async (req, res)=>{
    try {
        const productId = parseInt(req.params.pid);
        const updatedFields = req.body;
        const product = await productServices.update(productId, updatedFields);
    
        res.status(200).json({ message: 'Producto actualizado con éxito', product });
        
    } catch (error) {
        console.log("Error al actualizar el producto");
        
    }
}

const deleteProduct = async (req, res)=>{
    const productId = parseInt(req.params.pid);
    if (productId) {
        productServices.delete(productId);
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } else {
        res.status(400).json({message:"No se encontro el producto a eliminar"})
    }
    
}

export default {
    getProducts,
    getProductsById,
    createProducts,
    updateProduct,
    deleteProduct
}