import { Router } from "express";
import productsControllers from "../controllers/products.controllers.js";
import bodyParser from 'body-parser';

const router = Router();

router.use(bodyParser.json());

router.get("/", productsControllers.getProducts);
router.get("/:pid", productsControllers.getProductsById);
router.post('/', productsControllers.createProducts);
router.put('/:pid', productsControllers.updateProduct);
router.delete('/:pid', productsControllers.deleteProduct);

export default router;