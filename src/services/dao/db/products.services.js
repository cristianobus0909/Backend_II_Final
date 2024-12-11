import ProductModel from "./models/products.models.js";


export default class ProductServices {
    constructor() {
        console.log("Trabajando con productos, persistiendo BD con MongoDb");
        
    }
    getAll = async () => {
        let page;
        let limit;
        const options = { page, limit, lean: true };
        const result = await ProductModel.find().paginate({},options);
        return result;
    };
    getById = async (id) => {
        const result = await ProductModel.findById(id);
        return result;
    };
    create = async (product) => {
        const result = await ProductModel.create(product);
        return result;
    };
    update = async (id, updatedFields) => {
        const result = await ProductModel.updateOne(id,updatedFields);
        return result;
    };
    delete = async (id) => {
        const result = await ProductModel.deleteOne(id);
        return result;    }
}