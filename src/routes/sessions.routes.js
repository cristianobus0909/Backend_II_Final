import { Router } from "express";
import userControllers from "../controllers/users.controllers.js";
import passport from "passport";
import { authToken, passportCall, autorization } from "../utils.js";


const routerSessions = Router();


routerSessions.post('/login', passport.authenticate('login',{failureRedirect:'/api/sessions/login-failed'}),userControllers.loginUser);
routerSessions.post("/register",passport.authenticate('register', {session:false}), userControllers.registerUser);
routerSessions.get('/login-failed',userControllers.loginFailUser);
routerSessions.get("/logout", userControllers.logoutUser);
routerSessions.get('/profile', passportCall('jwt',{session:false}),autorization("user"),userControllers.profileUser);
routerSessions.get('/admin', passportCall('jwt',{session:false}),autorization("admin"),userControllers.adminUser);
routerSessions.get("/github", passport.authenticate('github', { scope: ['user:email'] }));
routerSessions.get("/githubcallback", passport.authenticate('github', {failureRedirect:'/github/error'}), userControllers.gitHubUser);



// routerSessions.post('/register', async (req, res) => {
//     try{
//         const { first_name, last_name, age, email, password } = req.body;
//         const exist = await userModel.findOne( {email: email} );
//         if (exist) {
//             return  res.status(409).json({ message: 'User already exists' });
//         }
        
//         const user = {
//             first_name,
//             last_name,
//             age,
//             email,
//             password
//         };
//         const result = await userModel.create(user);
//         res.status(200).json("Usuario creado con exito" + result.id);
//     } catch(err){
//         console.error(err.message);
//         res.status(500).send("Server error");
//     }
// });
// routerSessions.post('/login', async(req, res) => {
//     const {email, password} = req.body
//     const user = await userModel.findOne({email,password})
//     console.log(user);
//     if (!user) {
//         return res.status(401).json('No autorizado')
//     }
//     req.session.user = {
//         name:`${user.first_name} ${user.last_name}`,
//         email:user.email,
//         age:user.age,
//         role:''
//     }
//     if (user.email === "adminCoder@coder.com" && user.password === "adminCod3r123") {
//             req.session.user.role = "admin"
//             console.log("Tenes privilegios de "+ req.session.user.role);
//     } else {
//             req.session.user.role = "user"
//             console.log("Tenes privilegios de "+ req.session.user.role);
//     }
//     res.status(200).send({payload: req.session.user, message: 'Inicio de sesion exitoso'});

// });

// async function autenticateUser(req,res,next){
//     if (!req.session.user) {
//         return res.status(401).json({ message: 'Debe iniciar sesión' });
//     }
//     next();
// }

// routerSessions.get('/private', autenticateUser, (req,res)=>{
//     console.log("Tenes privilegios de"+ req.session.user.role);
//     res.send(req.session.user.role);
// })
// routerSessions.get('/', autenticateUser, (req,res)=>{
//     console.log("Tenes privilegios de"+ req.session.user.role);
//     res.send(req.session.user.role);
// })



export  default  routerSessions;

