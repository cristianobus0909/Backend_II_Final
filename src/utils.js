import {fileURLToPath} from  'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));

export const isValidPassword = (user,password)=> bcrypt.compareSync(password, user.password);

export const PRIVATE_KEY = config.privateKey || "privatekey";

export  const generateToken = (user)=>{
    return jwt.sign({user},PRIVATE_KEY,{expiresIn: '1h'})
}

export const authToken = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).send({error:"No autenticado"});
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY,(error,credentials)=>{
        if(error) return res.status(403).send({error:'No autorizado'});
        req.user = credentials.user;
        next();
    })

}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ message: info ? info.message : "Error de autenticación" });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};


export const  autorization = (role)=>{
    return async (req,res,next)=>{
        if(!req.user) return res.status(403).send({message : 'No Autorizado'});
        if (req.user.role !== role) {
            return res.status(403).send(`Forbidden: Requires ${role} role`)
        };
        next();
    };
};


export default __dirname;
