import dotenv from  'dotenv';
import program from '../process.js';


const environment = program.opts().env || 'development';
const envFile = environment === 'production' ? 'src/config/.env.production' : 'src/config/.env.development';

dotenv.config({
    path:envFile
})

export default {
    port: process.env.PORT,
    db: process.env.URL_MONGO,
    sessionSecret:process.env.SESSION_SECRET,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    privateKey: process.env.PRIVATE_KEY

}