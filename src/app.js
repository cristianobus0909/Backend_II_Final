import express from  'express';
import __dirname from './utils.js'
import  handlebars from 'express-handlebars';
import session from 'express-session';
import mongoose from 'mongoose';
import routerViews from './routes/users.views.routes.js';
import routerSessions from './routes/sessions.routes.js';
import viewsRouter from './routes/views.routes.js';
import bodyParser from 'body-parser'
import MongoStore from  'connect-mongo';
import dotenv from  'dotenv';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


const URL_MONGO = process.env.URL_MONGO;
console.log(process.env.URL_MONGO);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars',  handlebars.engine());
app.set( 'view engine' , 'handlebars');
app.set('views', __dirname + "/views");

app.use('/', express.static( __dirname + "/public"));

app.use(cookieParser("s3cr3tC00ck13"));



app.use(session({
    store: MongoStore.create({
        mongoUrl: URL_MONGO,
        collectionName: "sessions",
        // mongoOptions:{useNewUrlParser: true, useUnifiedTopology: true},
        ttl:10 * 60
    }),
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,

}))

app.use('/', viewsRouter)
app.use('/users',routerViews)
app.use('/api/sessions',routerSessions)

mongoose.connect(URL_MONGO, {dbName: 'ecommerce'})
    .then(()=>{
        console.log('Db connectado !!');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en: http://localhost:${PORT}`)
        });
    
    })
    .catch(err => {
        console.error('Error conectando la BD:', err.message);
    });