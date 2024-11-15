
import mongoose from 'mongoose';
import config from './config.js';

export default class MongoSingleton {
    static #instance;

    constructor(){
        this.#connectMongoDB();

    }
    static getInstance(){
        if(this.#instance){
            console.log("Ya se abrio una coneccion con MongoDB.");
        }else{
            this.#instance = new MongoSingleton();
        }
        return this.#instance
    }
    #connectMongoDB = async ()=>{
        try {
            mongoose.connect(config.db)
            console.log("Conectado con exito a MongoDb usando Mongoose.");
        } catch (error) {
            console.error("No se pudo conectar a la Bd usando Mongoose:" + error);
            process.exit();
        }
    }
}