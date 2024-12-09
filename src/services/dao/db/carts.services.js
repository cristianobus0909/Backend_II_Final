import cartsModel from "./models/carts.models.js"


export default class CartService {
    constructor() {
        console.log("Trabajando con carritos, persistiendo BD con MongoDb ");
        
    };
    getAll = async () => {
        const carts = await cartsModel.find().lean()
        return  carts;
    };
    getById = async (id) => {
        const cartById = await cartsModel.findById({_id: id});
        return cartById;
    };
    create = async () => {
        const result = cartsModel.create();
        return result;
    };
    update = async (id, product) => {
        const result = await cartsModel.updateOne({ _id: id },{products:product});
        return result;
    };
    
}