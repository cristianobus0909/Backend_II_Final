import UserServices from "../services/dao/db/users.services.js";
import { isValidPassword, generateToken } from "../utils.js";

const userServices = new UserServices


const loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await userServices.getOne({email:email})
        if (!user) {
            return res.status(204).json('Usuario inexistente')
        }
        if (!isValidPassword(user,password)) return  res.status(401).json('Usuario y contraseña incorrecta');
        const tokenUser = {
            name:`${user.first_name} ${user.last_name}`,
            email:user.email,
            age:user.age,
            role:user.role
        }
        const token = generateToken(tokenUser);
        res.cookie('jwtCookieToken', token,{maxAge:900000, httpOnly: true});
        res.send(`Bienvenido ${tokenUser.name}`);
    } catch (error) {
        console.error(error);
        return  res.status(500).json("Error interno de la aplicacion")
    }
}
const registerUser = async (req,res)=>{
    console.log('Registrando usuario: ', req.body);
    res.status(201).send({status:'success', message: 'usuario creado correctamente'});
}
const logoutUser = (req,res)=>{
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).send({ message: "Error al Cerrar Sesión", error });
        } 
        res.status(200).send({message:"La sesión se ha cerrado correctamente"});
    });
}
const loginFailUser = (req,res)=>{
    res.send({error:"Error al intentar logearse"});
}
const profileUser = (req,res)=>{
    res.redirect('/users',{
        user: req.user
    })
}
const adminUser = (req,res)=>{
    res.redirect('/',{
        user: req.user
    })
}
const gitHubUser = async(req,res)=>{
    const user = req.user;
    req.session.user = {
        name:`${user.first_name} ${user.last_name}`,
        email:user.email,
        age:user.age
    }
    req.session.admin = true;
    res.redirect('/users');
}

export default {
    loginUser,
    registerUser,
    logoutUser,
    loginFailUser,
    profileUser,
    adminUser,
    gitHubUser
}