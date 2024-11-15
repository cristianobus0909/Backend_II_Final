import { Router } from "express";
import passport from "passport";
import { isValidPassword, authToken, generateToken } from "../utils.js";

const router = Router();


router.post('/login', passport.authenticate('login',{failureRedirect:'/api/jwt/login-failed'}),
    async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await userModel.findOne({email,password})
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
            console.log(token);
            res.cookie('jwtCookieToken', token,{maxAge:900000, httpOnly: false});
            res.send(`Bienvenido ${tokenUser.name}`);
        } catch (error) {
            console.error(error);
            return  res.status(500).json("Error interno de la aplicacion")
        }

});
router.post("/register",passport.authenticate('register', {session:false}), async (req,res)=>{
    console.log('Registrando usuario: ', req.body);
    res.status(201).send({status:'success', message: 'usuario creado correctamente'});
});


export default router;