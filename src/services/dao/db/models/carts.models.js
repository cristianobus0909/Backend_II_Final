import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity:{
                type: Number,
                required: true,
                min: 1
            }
        }],
        default: []
    }
});

cartSchema.pre('findOne', function(next){
    this.populate('products.productId');
    next()
});

const cartsModel = mongoose.model(cartsCollection, cartSchema);

export default cartsModel;