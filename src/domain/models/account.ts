/**
 * @openapi
 * components:
 *   schemas:
 *     AccountRequestModel:
 *       type: object
 *       required:
 *         - name
 *         - domain
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre de la cuenta
 *         domain:
 *           type: string
 *           description: Dominio asociado a la cuenta
 *         parent_account_id:
 *           type: integer
 *           description: ID de la cuenta padre (opcional)
 *
 *     UpdateAccountRequestModel:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la cuenta a actualizar
 *         name:
 *           type: string
 *           description: Nuevo nombre de la cuenta (opcional)
 *         domain:
 *           type: string
 *           description: Nuevo dominio de la cuenta (opcional)
 *         parent_account_id:
 *           type: integer
 *           description: Nuevo ID de la cuenta padre (opcional)
 *
 *     AccountResponseModel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la cuenta
 *         name:
 *           type: string
 *           description: Nombre de la cuenta
 *         domain:
 *           type: string
 *           description: Dominio asociado a la cuenta
 *         parent_account_id:
 *           type: integer
 *           description: ID de la cuenta padre (opcional)
 */

export interface AccountRequestModel {
    name: string;
    domain: string;
    parent_account_id?: number;
}

export interface UpdateAccountRequestModel {
    id: number;
    name?: string;
    domain?: string;
    parent_account_id?: number;
}

export interface AccountResponseModel {
    id: number;
    name: string;
    domain: string;
    parent_account_id?: number;
}

export interface AccountUserRelResponseModel {
    id?: number;
    user_id: string;
    account_id: number;
    account?: AccountRequestModel
}


export interface AssociateUserToAccountsRequestModel {
    user_id: string;
    accounts: number[];
}