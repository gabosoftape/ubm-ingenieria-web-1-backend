import express from "express";
import { Request, Response } from 'express';
import {AccountRequestModel, AssociateUserToAccountsRequestModel, UpdateAccountRequestModel} from "../../domain/models/account";
import {DefaultFilterCriteria} from "../../domain/interfaces/common/default-filter-criteria";
import {ICreateAccountCase} from "../../domain/interfaces/use-cases/accounts/i-create-account-case";
import {IUpdateAccountCase} from "../../domain/interfaces/use-cases/accounts/i-update-account-case";
import {IDeleteAccountCase} from "../../domain/interfaces/use-cases/accounts/i-delete-account-case";
import {IGetAllAccountCase} from "../../domain/interfaces/use-cases/accounts/i-get-all-account-case";
import {
    IGetSelfAvailableAccountsCase
} from "../../domain/interfaces/use-cases/accounts/i-get-self-available-accounts-case";
import {IAuthDataRequest, IGetAuthTokenRequest} from "../../middlewares/authentication";
import { IAssociateUserToAccountsUseCase } from "../../domain/interfaces/use-cases/accounts/i-associate-user-to-accounts-case";


export default function AccountsRouter(
    createAccountUseCase: ICreateAccountCase,
    updateAccountUseCase: IUpdateAccountCase,
    deleteAccountUseCase: IDeleteAccountCase,
    getAllAccountUseCase: IGetAllAccountCase,
    getSelfAvailableAccountsUseCase: IGetSelfAvailableAccountsCase,
    associateUserToAccountsUseCase: IAssociateUserToAccountsUseCase,
) {
    const router = express.Router();
    /**
     * @openapi
     * /api/v1/accounts/create:
     *   post:
     *     summary: Crea una nueva cuenta
     *     tags: [Accounts]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AccountRequestModel'
     *     responses:
     *       200:
     *         description: Cuenta creada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AccountResponseModel'
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
    // create account
    router.post('/create', async (req:Request, res: Response) => {
        try {
            let user_email = (req as IGetAuthTokenRequest).authEmail;
            let user_id = (req as IGetAuthTokenRequest).authUserId;
            console.log(user_id);
            console.log(user_email);
            const account: AccountRequestModel = req.body;
            const new_account = await createAccountUseCase.execute(account, user_id);
            res.send(new_account);
        } catch (error) {
            res.status(500).send({
                message: 'error fetching data'
            });
        }
    });
    /**
     * @openapi
     * /api/v1/accounts/update:
     *   put:
     *     summary: Actualiza una cuenta existente
     *     tags: [Accounts]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateAccountRequestModel'
     *     responses:
     *       200:
     *         description: Cuenta actualizada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AccountResponseModel'
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
    // update account
    router.put('/update', async (req:Request, res: Response) => {
        try {
            const account: UpdateAccountRequestModel = req.body;
            const data = await updateAccountUseCase.execute(account);
            res.send(data);
        } catch (error) {
            res.status(500).send({
                message: 'error fetching data'
            });
        }
    });

    /**
     * @openapi
     * /api/v1/accounts/delete/{account_id}:
     *   delete:
     *     summary: Elimina una cuenta
     *     tags: [Accounts]
     *     parameters:
     *       - in: path
     *         name: account_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la cuenta a eliminar
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

    // delete account
    router.delete('/delete/:account_id', async (req:Request, res: Response) => {
        try {
            const data = await deleteAccountUseCase.execute(parseInt(req.params.account_id));
            res.send(data);
        } catch (error) {
            res.status(500).send({
                message: 'error fetching data'
            });
        }
    });

    /**
     * @openapi
     * /api/v1/accounts/all:
     *   get:
     *     summary: Obtiene todas las cuentas
     *     tags: [Accounts]
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
     *         description: Lista de cuentas obtenida exitosamente
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

    // get all account
    router.get('/all', async (req:Request, res: Response) => {
        try {
            const account_id = parseInt(req.query.account_id as string);
            const dataAuthRequest: IAuthDataRequest = {
                authUserId: (req as IGetAuthTokenRequest).authUserId,
                authRole: (req as IGetAuthTokenRequest).authRole,
                authEmail: (req as IGetAuthTokenRequest).authEmail,

            }
            const dto = req.query as unknown as DefaultFilterCriteria
            dto.dataAuth = dataAuthRequest;
            const data = await getAllAccountUseCase.execute(dto, account_id);
            res.send(data);
        } catch (error) {
            res.status(500).send({
                message: error
            });
        }
    });

    // get self accounts
    router.get('/self', async (req:Request, res: Response) => {
        try {
            let user_id = (req as IGetAuthTokenRequest).authUserId;
            const data = await getSelfAvailableAccountsUseCase.execute(user_id);
            res.send(data);
        } catch (error) {
            res.status(500).send({
                message: error
            });
        }
    });

    // get self accounts
    router.get('/user/:user_id', async (req:Request, res: Response) => {
        try {
            let user_id = req.params.user_id;
            const data = await getSelfAvailableAccountsUseCase.execute(user_id);
            res.send(data);
        } catch (error) {
            res.status(500).send({
                message: error
            });
        }
    });


    // asociate user to accounts
    router.post('/associate', async (req:Request, res: Response) => {
        try {
            const dataBody: AssociateUserToAccountsRequestModel = req.body;
            const data = await associateUserToAccountsUseCase.execute(dataBody);
            res.send(data);
        } catch (error) {
            res.status(500).send({
                message: error
            });
        }
    });

    return router;
}