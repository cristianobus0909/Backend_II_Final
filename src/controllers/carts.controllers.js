import ProductModel from "../services/dao/db/models/products.models.js";
import CartService from "../services/dao/db/carts.services.js";
import TiketService from "../services/dao/db/ticket.services.js"

const cartService = new CartService()
const ticketService = new TiketService()

const getCarts = async(req,res)=>{
    try {
        const allCarts = await cartService.getAll();
        return res.status(201).send(allCarts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
}

const createCart =  async (req, res) => {
    try {
        const newCart = await cartService.create({...req.body});
        return res.status(201).send(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
}

const getCartById = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cartProducts = await cartService.getById(cartId);
        if (!cartProducts) {
            return res.status(404).json({ message: 'No se encontró el carrito.' })
        }
        res.render('cart', { cartProducts });
        
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const addProductToCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "La cantidad debe ser mayor a 0." });
        }

        const cart = await cartService.getById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "El carrito no existe." });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "El producto no existe." });
        }

        const existingProduct = cart.products.find(
            (item) => item.productId?.toString() === productId
        );

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({
                productId: productId,
                quantity: quantity
            });
        }

        await cart.save();

        res.status(200).json({ message: "Producto agregado al carrito.", cart });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

const deleteProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await cartsModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "El carrito no existe." });
        }

        cart.products = cart.products.filter(
            (item) => item.productId.toString() !== productId
        );
        await cart.save();

        res.status(200).json({ message: "Producto eliminado del carrito." });
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

const updateCart = async (req, res) => {
    const cartId = req.params.cid;
    const products = req.body.products;
    
    try {
        const cart =  await cartService.findOne(cartId);
        if(!cart){
            return res.status(404).json({message:'Carrito no encontrado'})
        };
        
        await cartService.update({ _id: cart._id },{products:products}, function(err, result ){
            if(err){
                res.status(500).json({ error:'Error al guardar los cambios' });
            }else{
                res.status(201).send(result);
            }  
        });
    } catch (error) {
        console.error(error,"Error al actualizar el producto")
        res.status(500).send("No se pudo actualizar el documento")
    }
}

const updateProductsCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "La cantidad debe ser un número mayor a 0." });
        }

        const cart = await cartService.getById(cid);
        if (!cart) {
            return res.status(404).json({ message: "El carrito no existe." });
        }

        const productIndex = cart.products.findIndex(
            (item) => item.productId.toString() === pid
        );

        if (productIndex === -1) {
            return res.status(404).json({ message: "El producto no existe en el carrito." });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({
            message: "Cantidad actualizada con éxito.",
            cart,
        });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

const emptyCart = async (req, res) => {
    try {
        const cartId = req.params.cid;

        const cart = await cartService.getById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "El carrito no existe." });
        }

        cart.products = [];
        await cart.save();

        res.status(200).json({ message: "Todos los productos del carrito han sido eliminados.", cart });
    } catch (error) {
        console.error("Error al eliminar productos del carrito:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

const purchaseCart = async (req, res) => {
    const { cid } = req.params;
    const purchaserEmail = req.body.email;
    let totalAmount = 0;
    let unavailableProducts = [];
    const purchasedProducts = [];

    try {
        const cart = await cartService.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart.products.forEach(cartItem => {
            const product = cartItem.product;
            const quantityInCart = cartItem.quantity;

            if (product.stock >= quantityInCart) {
                product.stock -= quantityInCart;
                totalAmount += product.price * quantityInCart;
                product.save();
                purchasedProducts.push(cartItem);
            } else {
                unavailableProducts.push(product._id);
            }
        });

        let ticket 
        if (purchasedProducts.length > 0) {
            ticket = {
                amount: totalAmount,
                purchaser: purchaserEmail,
                code: `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                purchase_datetime: new Date()
            };
            await ticketService.create(ticket);;
        }

        cart.products = cart.products.filter(cartItem =>
            unavailableProducts.includes(cartItem.product._id)
        );
        await cart.save();

        res.status(200).json({
            message: 'Compra finalizada',
            ticket: ticket || null,
            unavailableProducts
        });
    } catch (error) {
        console.error('Error en la compra:', error);
        res.status(500).json({ message: 'Error al procesar la compra' });
    }
}

export default {
    createCart,
    getCartById,
    getCarts,
    addProductToCart,
    deleteProductCart,
    updateCart,
    updateProductsCart,
    emptyCart,
    purchaseCart

}