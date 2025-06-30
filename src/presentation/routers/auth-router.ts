import {IVerifyUserByAccountUseCase} from "../../domain/interfaces/use-cases/auth/i-verify-user-by-account-use-case";
import express from "express";
import { Request, Response } from 'express';
import {VerifyAuthTokenCaseUse} from "../../infrastructure/use-cases/auth/verify-auth-token-case-use";
import jwt from "jsonwebtoken";
import { ILoginUseCase } from "../../domain/interfaces/use-cases/auth/i-login-use-case";
import { IRegisterUseCase } from "../../domain/interfaces/use-cases/auth/i-register-use-case";
import { ILoginGoogleUseCase } from "../../domain/interfaces/use-cases/auth/i-login-google-use-case";
import { IRegisterGoogleUseCase } from "../../domain/interfaces/use-cases/auth/i-register-google-use-case";
import { RegisterUserRequest } from "../../domain/models/auth";
import { IUpdateUserPasswordUseCase } from "../../domain/interfaces/use-cases/auth/i-update-user-password-use-case";

export default function AuthRouter(
    verifyUserByAccountUseCase: IVerifyUserByAccountUseCase,
    verifyAuthTokenCaseUse: VerifyAuthTokenCaseUse,
    loginUseCase: ILoginUseCase,
    registerUseCase: IRegisterUseCase,
    loginGoogleUseCase: ILoginGoogleUseCase,
    registerGoogleUseCase: IRegisterGoogleUseCase,
    updateUserPasswordUseCase: IUpdateUserPasswordUseCase
) {
    const router = express.Router();
    /**
     * @openapi
     * /api/v1/auth/verifyUser:
     *   post:
     *     summary: Verifica un usuario por cuenta
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/VerifyUserByAccountRequest'
     *     responses:
     *       200:
     *         description: Usuario verificado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/VerifyUserByAccountResponse'
     *       404:
     *         description: Usuario no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/VerifyUserByAccountResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *
     * /api/v1/auth/authToken:
     *   get:
     *     summary: Verifica un token de autenticación
     *     tags: [Auth]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Token verificado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/VerifyAuthTokenResponse'
     *       401:
     *         description: Token expirado o falta el encabezado de autorización
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       403:
     *         description: Token inválido
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *
     * /api/v1/auth/login/google:
     *   post:
     *     summary: Iniciar sesión con Google
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - google_uid
     *               - name
     *               - photo_url
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Email del usuario de Google
     *               google_uid:
     *                 type: string
     *                 description: ID único de Google del usuario
     *               name:
     *                 type: string
     *                 description: Nombre del usuario
     *               photo_url:
     *                 type: string
     *                 description: URL de la foto de perfil
     *     responses:
     *       201:
     *         description: Login exitoso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LoginResponse'
     *       404:
     *         description: Usuario no encontrado
     *       401:
     *         description: Credenciales inválidas
     *       500:
     *         description: Error interno del servidor
     *
     * /api/v1/auth/register/google:
     *   post:
     *     summary: Registrar usuario con Google
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - phone
     *               - role
     *               - google_uid
     *               - photo_url
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nombre del usuario
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Email del usuario
     *               phone:
     *                 type: string
     *                 description: Teléfono del usuario
     *               role:
     *                 type: string
     *                 description: Rol del usuario
     *               google_uid:
     *                 type: string
     *                 description: ID único de Google del usuario
     *               photo_url:
     *                 type: string
     *                 description: URL de la foto de perfil
     *     responses:
     *       201:
     *         description: Registro exitoso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RegisterResponse'
     *       401:
     *         description: Email ya registrado
     *       500:
     *         description: Error interno del servidor
     *
     * components:
     *   securitySchemes:
     *     BearerAuth:
     *       type: http
     *       scheme: bearer
     *       bearerFormat: JWT
     *
     *   schemas:
     *     VerifyUserByAccountRequest:
     *       type: object
     *       required:
     *         - phone
     *         - account_id
     *       properties:
     *         phone:
     *           type: string
     *           description: Número de teléfono del usuario
     *         account_id:
     *           type: integer
     *           description: ID de la cuenta asociada
     *
     *     VerifyUserByAccountResponse:
     *       type: object
     *       properties:
     *         status:
     *           type: integer
     *         message:
     *           type: string
     *         token:
     *           type: string
     *           nullable: true
     *
     *     VerifyAuthTokenResponse:
     *       type: object
     *       properties:
     *         status:
     *           type: integer
     *         message:
     *           type: string
     *         data:
     *           $ref: '#/components/schemas/UserAttributes'
     *
     *     UserAttributes:
     *       type: object
     *       properties:
     *         id:
     *           type: integer
     *         name:
     *           type: string
     *         email:
     *           type: string
     *         # Añade aquí otros atributos del usuario según sea necesario
     *
     *     ErrorResponse:
     *       type: object
     *       properties:
     *         message:
     *           type: string
     *         error:
     *           type: object
     */

    router.post('/verifyUser', async (req: Request, res: Response) => {
        try {
            console.log('este es le dato enviado por el cliente');
            console.log(req.body);
            const resVerify = await verifyUserByAccountUseCase.execute(req.body);
            if (resVerify.status === 404) {
                res.status(404).send(resVerify);
                return;
            }
            res.status(resVerify.status).send(resVerify);
        } catch (error) {
            console.log('este es el error en la autenticcacion del login');
            console.error(error);
            res.status(500).send({
                message: 'internal server error',
                error: error
            });
        }
    });
    router.get('/authToken', async (req: Request, res: Response) => {
        try {
            const tokenHeader = req.headers['authorization'];
            if (!tokenHeader) {
                res.status(401).json({ message: 'Falta el encabezado de autorización' });
                return;
            }
            const token = tokenHeader.split(' ')[1];
            const response = await verifyAuthTokenCaseUse.execute(token);
            res.status(response.status).send(response);
        } catch (error: any) {
            console.log('este es el error al verificar el token');
            console.error(error);
            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ message: 'El token ha expirado' });
            } else {
                res.status(403).json({ message: 'Token inválido' });
            }
            res.status(500).send({
                message: error.parent.detail ? error.parent.detail : 'Internal server error',
                error: error
            });
        }
    });
    
    
    router.post('/login', async (req: Request, res: Response) => {
        try {
            console.log('este es le dato enviado por el cliente');
            console.log(req.body);
            const { email, password } = req.body;
            const resVerify = await loginUseCase.execute(email, password);
            if (resVerify.status === 404) {
                res.status(404).send(resVerify);
                return;
            }
            res.status(resVerify.status).send(resVerify);
        } catch (error) {
            console.log('este es el error en la autenticcacion del login');
            console.error(error);
            res.status(500).send({
                message: 'internal server error',
                error: error
            });
        }
    });

    router.post('/login/google', async (req: Request, res: Response) => {
        try {
            console.log('Datos de login con Google enviados por el cliente:');
            console.log(req.body);
            const resVerify = await loginGoogleUseCase.execute(req.body);
            if (resVerify.status === 404) {
                res.status(404).send(resVerify);
                return;
            }
            res.status(resVerify.status).send(resVerify);
        } catch (error) {
            console.log('Error en la autenticación con Google:');
            console.error(error);
            res.status(500).send({
                message: 'internal server error',
                error: error
            });
        }
    });

    router.post('/register', async (req: Request, res: Response) => {
        try {
            console.log('este es le dato enviado por el cliente');
            console.log(req.body);
            const { id, name, email, password, role, phone } = req.body;
            const registeruser: RegisterUserRequest = {
                id,
                name,
                email,
                password,
                role,
                phone
            }
            const resVerify = await registerUseCase.execute(registeruser);
            if (resVerify.status === 404) {
                res.status(404).send(resVerify);
                return;
            }
            res.status(resVerify.status).send(resVerify);
        } catch (error) {
            console.log('este es el error en el registro del usuario');
            console.error(error);
            res.status(500).send({
                message: 'internal server error',
                error: error
            });
        }
    });

    router.post('/register/google', async (req: Request, res: Response) => {
        try {
            console.log('Datos de registro con Google enviados por el cliente:');
            console.log(req.body);
            const resVerify = await registerGoogleUseCase.execute(req.body);
            if (resVerify.status === 404) {
                res.status(404).send(resVerify);
                return;
            }
            res.status(resVerify.status).send(resVerify);
        } catch (error) {
            console.log('Error en el registro con Google:');
            console.error(error);
            res.status(500).send({
                message: 'internal server error',
                error: error
            });
        }
    });

    router.post('/update-password', async (req: Request, res: Response) => {
        try {
            const { userId, password } = req.body;
            if (!userId || !password) {
                return res.status(400).json({
                    message: 'Se requieren userId y password'
                });
            }

            const result = await updateUserPasswordUseCase.execute(userId, password);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            return res.status(500).json({
                message: 'Error interno del servidor',
                error: error
            });
        }
    });

    return router;
}