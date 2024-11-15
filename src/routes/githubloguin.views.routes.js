import { Router } from "express";

const  routerGithub = Router();

routerGithub.get('/login',(req,res)=>{
    res.render('githublogin',{});
})
routerGithub.get('/error',(req,res)=>{
    res.render('error',{error: "No se pudo autenticar con Github"});
})

export default routerGithub;