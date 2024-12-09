import express from  'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js'
import dotenv from  'dotenv';
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import initializePassport from './config/passport.config.js';
import passport from 'passport';

import routerUsers from './routes/users.views.routes.js';
import routerCarts from './routes/carts.routes.js';
import routerProducts from './routes/products.routes.js';
import jwtRoutes from './routes/jwt.routes.js';
import routerSessions from './routes/sessions.routes.js'
import viewsRouter from './routes/views.routes.js';
// import MongoSingleton from './config/mongodb-singleton.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const URL_MONGO = process.env.URL_MONGO;


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', express.static( __dirname + "/public"));

app.use(cookieParser("s3cr3tC00ck13"));

app.engine('handlebars',  handlebars.engine());
app.set( 'view engine' , 'handlebars');
app.set('views', __dirname + "/views");



app.use(session({
    store: MongoStore.create({
        mongoUrl: URL_MONGO,
        collectionName: "sessions",
        ttl:10 * 60
    }),
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,

}))
initializePassport();
app.use(passport.initialize())


app.use('/', viewsRouter);
app.use('/users',routerUsers);
app.use('/api/sessions',routerSessions);
app.use('/api/products',routerProducts);
app.use('/api/carts',routerCarts);

// MongoSingleton()

mongoose.connect(URL_MONGO, {dbName: 'ecommerce'})
.then(()=>{
    console.log('Db connectado !!');
})
.catch(err => {
    console.error('Error conectando la BD:', err.message);
});

const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`)
});
const io = new Server(server)

const message = [];

io.on("connection", (socket) => {
    console.log(`User ${socket.id} Connection`);

    let userName = "";

    socket.on("userConnection", (data) => {
        userName = data.user;
        message.push({
            id: socket.id,
            info: "connection",
            name: data.user,
            message: `${data.user} Conectado`,
            date: new Date().toTimeString(),
        });
        io.sockets.emit(
            "userConnection", 
            { message, nameUser: userName }
        );
    });

    socket.on("userMessage", (data) => {
        message.push({
            id: socket.id,
            info: "message",
            name: userName,
            message: data.message,
            date: new Date().toTimeString(),
        });
        io.sockets.emit("userMessage", message);
    });

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });
});
export { io };