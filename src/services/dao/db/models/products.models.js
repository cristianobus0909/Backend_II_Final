import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, index: true, required: true},
    category: {type: String, required: true},
    thumbnails: {
        type: [{
            type: String,  
            imagePath: {
                type: String,
                default: 'https://img.freepik.com/vector-gratis/ilustracion-icono-galeria_53876-27002.jpg?w=740&t=st=1699187254~exp=1699187854~hmac=6dc0424826b7aa7168fb633cb9a20b855b2a863526e6e6a7f16a72dfa69f47ba'
            }
        }],
        default: []
    },
    status: Boolean,
    code: {type: String, required: true},
    stock: {type: Number, required:true},
    quantity:{
        type: Number,
        required: false,
        default: 1
    }
})
productSchema.plugin(mongoosePaginate);
const ProductModel = mongoose.model(productCollection, productSchema);

export default ProductModel;