import userModel from "./models/user.models.js";

export default class UserServices {
    constructor() {
        console.log("Trabajando con usuarios, persistiendo BD con MongoDB");
        
    }
    getOne = async (user) => {
        const result = await userModel.findOne(user);
        return result;
    }
    create = async (user) => {
        const result = await userModel.create(user);
        return result;
    }
    update = async (user, updatedFields) => {
        const result = await userModel.updateOne(user,updatedFields);
        return result;
    }
}