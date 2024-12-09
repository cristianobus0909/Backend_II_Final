import { Router } from "express";
import cartsController from "../controllers/carts.controllers.js";

const router = Router();


router.get("/", cartsController.getCarts );
router.post("/", cartsController.createCart);
router.get("/:cid", cartsController.getCartById);
router.post("/:cid/products/:pid", cartsController.addProductToCart);
router.delete("/:cid/products/:pid", cartsController.deleteProductCart);
router.put('/:cid', cartsController.updateCart);
router.put("/:cid/products/:pid", cartsController.updateProductsCart);
router.delete("/:cid", cartsController.emptyCart);
router.post('/:cid/purchase', cartsController.purchaseCart);


export default router;