import * as fs from 'fs';


class ProductManager  {
    constructor(path){
        this.path = path;
        this.products = [];
        this.autoIncrementId = Date.now().toString(36);
    }
    
    getProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            return this.products; 
        } catch (error) {
            console.error(error, 'No se pudo obtener ningún archivo');
            return []; 
        }
    }
    addProduct = async (title,description,price,category,thumbnails,code,stock,status = true) => {
        let newProduct;
        const data = await fs.promises.readFile(this.path, 'utf-8');
        let productsFromFile = JSON.parse(data); 
        try {
            if (!title || !description || !price || !category || !thumbnails || !code || stock === undefined) {
                console.log("Todos los campos son obligatorios.");
                return;
            };
            
            if (productsFromFile.some((product) => product.code === code.trim())) {
                console.log(`El producto con código ${code} ya existe.`);
                return;
            };
            
            const existingProduct = this.products.find((product) => product.code === code.trim());
            if (existingProduct) {
                existingProduct.quantity++;
                console.log(`El producto con el código ${code} ahora tiene ${existingProduct.quantity} unidades.`);
            }else{
                newProduct = {
                    id: this.autoIncrementId,
                    title,
                    description,
                    price,
                    category,
                    thumbnails,
                    code,
                    status,
                    stock,
                    quantity: 1
                };
                this.products.push(newProduct);
            }
            
            if (existingProduct) {
                const existingProductIndex = productsFromFile.findIndex((product) => product.code.trim() === code.trim());
                productsFromFile[existingProductIndex] = existingProduct;
            } else {
                productsFromFile.push(newProduct);
            }
            
            await fs.promises.writeFile(this.path, JSON.stringify(productsFromFile, null, 2), 'utf8');
            
            return newProduct;
        } catch (error) {
            console.error(error, 'No se pudo agregar el producto');
        }
    }
    getProductById = async(productId)=>{
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            const productById = this.products.find((e) => e.id === parseInt(productId));
            if (!productById) {
                return console.log('No se encontró el producto');
            }else {
                console.log(`Producto con el Id: ${productById.id} fue encontrado exitosamente`);
                return productById;
            }
        } catch (error) {
            console.error(error, 'No se encontro el id del producto')
            return null;
        }
        
    }
    
    updateProduct = async (id, updatedFields)=>{
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            let productsFromFile = JSON.parse(data);
            let index = productsFromFile.findIndex((element) => element.id == id);
            if (index === -1) {
                console.log(`El producto con el id:${id}, es inexistente `)
                return;
            }
            productsFromFile[index] = {
                ...productsFromFile[index],
                ...updatedFields
            }
            await fs.promises.writeFile(this.path, JSON.stringify(productsFromFile, null, 2), 'utf8')
        } catch (error) {
            console.error('No se pudo actualizar el producto')
        }
        
    };
    deleteProduct = async (id) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            let productsFromFile = JSON.parse(data);
            
            const productIndex = productsFromFile.findIndex((product) => product.id === id);
            if (productIndex === -1) {
            console.log("Producto no encontrado.");
            return;
            }
            
            productsFromFile.splice(productIndex, 1);
            
            fs.writeFileSync(this.path, JSON.stringify(productsFromFile, null, 2), 'utf8');
            return  true;
        } catch (error) {
            console.error("Error al leer o escribir en el archivo:", error);
        }
    };
}
const productManager = new ProductManager('./src/data/products.json')

export default productManager;