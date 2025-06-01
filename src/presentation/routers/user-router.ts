import {ICreateUserUseCase} from "../../domain/interfaces/use-cases/user/i-create-user-use-case";
import express from "express";
import { Request, Response } from 'express';
import {IGetAllUsersByAccountUseCase} from "../../domain/interfaces/use-cases/user/i-get-all-users-by-account-use-case";
import {DefaultFilterCriteria} from "../../domain/interfaces/common/default-filter-criteria";
import {IUpdateUserCase} from "../../domain/interfaces/use-cases/user/i-update-user-case";
import {IDeleteUserCase} from "../../domain/interfaces/use-cases/user/i-delete-user-case";
import {EditUserDto} from "../../domain/models/user";
import {IGetAuthTokenRequest} from "../../middlewares/authentication";
import { IGetUserByEmailUseCase } from "../../domain/interfaces/use-cases/user/i-get-user-by-email-use-case";

export default function UserRouter(
    createUserUseCase: ICreateUserUseCase,
    getAllUsersByAccountUseCase: IGetAllUsersByAccountUseCase,
    getUserByEmail: IGetUserByEmailUseCase,
    updateUserUseCase: IUpdateUserCase,
    deleteUserUseCase: IDeleteUserCase,
) {
    const router = express.Router();
    /**
     * @openapi
     * /api/v1/users/create:
     *   post:
     *     summary: Crea un nuevo usuario
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateUserDto'
     *     responses:
     *       200:
     *         description: Usuario creado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserResponseModel'
     *       500:
     *         description: Error del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: error fetching data
     */

    // create user
    router.post('/create', async (req: Request, res: Response) => {
        try {
            let user_email = (req as IGetAuthTokenRequest).authEmail;
            let user_id = (req as IGetAuthTokenRequest).authUserId;
            console.log(user_id);
            let user_data = await getUserByEmail.execute(user_email);
            if(user_data.status == 404){
                return res.status(401).send({ error: 'Error Searching email' });
            }
            const new_account = await createUserUseCase.execute(req.body, user_id);
            return res.status(new_account.status).send(new_account);
        } catch (error) {
            console.log('este es el error al crear un usuario');
            console.error(error);
            return res.status(500).send({
                message: 'internal server error',
                error: error
            });
        }
    });

    /**
     * @openapi
     * /api/v1/users/all:
     *   get:
     *     summary: Obtiene todos los usarios
     *     tags: [Users]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Número de página para la paginación
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Número de elementos por página
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *         description: Campo por el cual ordenar los resultados
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *         description: Orden de clasificación (ascendente o descendente)
     *     responses:
     *       200:
     *         description: Lista de usuarios obtenida exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 page:
     *                   type: string
     *                 pageSize:
     *                   type: string
     *       500:
     *         description: Error del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */

    router.get('/all', async (req: Request, res: Response) => {
        try {
            let user_email = (req as IGetAuthTokenRequest).authEmail;
            let user_id = (req as IGetAuthTokenRequest).authUserId;
            console.log(user_id);
            console.log(user_email);
            const account_id = parseInt(req.query.account_id as string);
            console.log("account_id",account_id);
            let user_data = await getUserByEmail.execute(user_email);
            if(user_data.status == 404){
                return res.status(401).send({ error: 'Error Searching Email' });
            }
            const all_users = await getAllUsersByAccountUseCase.execute(req.query as unknown as DefaultFilterCriteria, account_id);
            return res.status(200).send(all_users);
        } catch (error) {
            console.log('este es el error al obtener los usuarios');
            console.error(error);
            return res.status(500).send({
                message: 'internal server error',
                error: error
            });
        }
    });

    /**
     * @openapi
     * /api/v1/users/update:
     *   put:
     *     summary: Actualiza un usuario existente
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/EditUserDto'
     *     responses:
     *       200:
     *         description: Cuenta actualizada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/EditUserResponseDto'
     *       500:
     *         description: Error del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    
    // update user
    router.put('/update', async (req:Request, res: Response) => {
        try {
            const user: EditUserDto = req.body;
            let user_id = (req as IGetAuthTokenRequest).authUserId;
            const data = await updateUserUseCase.execute(user, user_id);
            return res.send(data);
        } catch (error) {
            return res.status(500).send({
                message: 'error fetching data'
            });
        }
    });

    /**
     * @openapi
     * /api/v1/users/delete/{user_id}:
     *   delete:
     *     summary: Elimina un usuario
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del usuario a eliminar
     *     responses:
     *       200:
     *         description: Cuenta eliminada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *       500:
     *         description: Error del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */


    // delete user
    router.delete('/delete/:user_id', async (req:Request, res: Response) => {
        try {
            const account_id = parseInt(req.query.account_id as string);
            const data = await deleteUserUseCase.execute(req.params.user_id, account_id);
            res.send(data);
        } catch (error) {
            res.status(500).send({
                message: 'error fetching data'
            });
        }
    });
    return router;
}