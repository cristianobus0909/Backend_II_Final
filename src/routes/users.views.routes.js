import { Router } from "express";

const routerViews = Router();

routerViews.get('/register', (req, res) => {
    res.render('register',{})
});
routerViews.get('/login', (req, res) => {
    
    res.render('login',{})
});
routerViews.get('/', (req, res) => {
    
    res.render('profile',{
        user: req.session.user
    })
});
routerViews.get( '/logout', (req,res)=>{
    res.redirect("/")
});


export  default  routerViews;