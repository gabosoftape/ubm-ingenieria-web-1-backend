import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';

import {sequelize} from './config/sequelizeConfig';


// import models
import './db/models/AccountModel';
import './db/models/AccountUserRelModel';
import './db/models/UserModel';
import './db/models/OtpDataModel';
import './db/asociation';
import logger from "./utils/logger";
import {setupSwagger} from "./utils/swaggerConfig";
import {checkIfAuthenticated, getAuthToken} from "./middlewares/authentication";
import { setupMiddlewares } from './utils/setupMiddlewares';

/**
 * @openapi
 * tags:
 *   - name: Accounts
 *     description: Operaciones relacionadas con cuentas
 *   - name: Users
 *     description: Operaciones relacionadas con usuarios
 *   - name: Auth
 *     description: Operaciones de autenticación
 *   - name: SendOtp
 *     description: Operaciones relacionadas con OTP
 * 
 *   - name: Blogs
 *     description: Operaciones relacionadas con Blogs
 */
export const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({origin: '*'}));
setupSwagger(app);
app.use((req, _res, next) => {
    logger.info(`Request: ${req.method} ${req.url}`);
    next();
});
const port = process.env.PORT || 4000;

const { 
        accountMiddleware,
        userMiddleware,
        authMiddleware,
        otpMiddleware
    } = setupMiddlewares();

// routes
app.use(getAuthToken);
app.use('/api/v1/accounts', checkIfAuthenticated, accountMiddleware);
app.use('/api/v1/users', checkIfAuthenticated, userMiddleware);
app.use('/api/v1/auth', authMiddleware);
app.use('/api/v1/sendOtp', otpMiddleware);

// cliente potencial - Lead 


async function main() {
    try {
        await sequelize.sync({alter: true});
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
            console.log(`Documentación de Swagger disponible en http://localhost:${port}/api-docs`);
        });
         // Usa el logger
    } catch (error) {
        console.error(`Hubo un error al conectar a la base de datos: ${error}`);
    }
}

main().then();