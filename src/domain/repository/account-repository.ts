import {IAccountRepository} from "../../domain/interfaces/repositories/i-account-repository";
import {
    AccountRequestModel,
    AccountResponseModel,
    AccountUserRelResponseModel,
    UpdateAccountRequestModel
} from "../../domain/models/account";
import {DefaultResponse} from "../../domain/interfaces/common/default-response";
import {DefaultFilterCriteria} from "../../domain/interfaces/common/default-filter-criteria";
import {Paginated} from "../../domain/interfaces/common/paginate";
import AccountModel from "../../db/models/AccountModel";
import AccountUserRelModel from "../../db/models/AccountUserRelModel";
import UserModel from "../../db/models/UserModel";

export class AccountRepository implements IAccountRepository {

    constructor() {
    }

    async create(account: AccountRequestModel): Promise<AccountResponseModel | DefaultResponse> {
        try {
            const new_account = await AccountModel.create(account);
            return {
                name: new_account.dataValues.name,
                domain: new_account.dataValues.domain,
                parent_account_id: new_account.dataValues.parent_account_id,
                id: new_account.dataValues.id,
            } as AccountResponseModel
        } catch (error: any) {
            return {message: error.response.message} as DefaultResponse;
        }
    }

    async delete(account_id: number): Promise<DefaultResponse> {
        try {
            const account = await AccountModel.findByPk(account_id);
            if (!account) {
                return {message: 'Account not found'} as DefaultResponse;
            } else {
                await account.destroy();
                return {message: 'Account deleted'} as DefaultResponse;
            }
        } catch (error:any) {
            return {message: error.response.message} as DefaultResponse;
        }
    }

    async getAll(query: DefaultFilterCriteria, account_id: number): Promise<Paginated<AccountResponseModel>> {
        try {
            const limit = query.pageSize ? +query.pageSize : 50;
            const offset = query.page && query.pageSize ? +query.page * +query.pageSize : 0;
            const count = await AccountModel.count();
            if(query.dataAuth?.authRole == 'sa'){
                const allAccounts = await AccountModel.findAll({
                    limit: limit,
                    offset: offset,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    order: [['id', 'DESC']]
                });
                return {
                    data: allAccounts ? allAccounts : [],
                    total: count ? count : 0
                } as Paginated<AccountResponseModel>
            }
            const allAccounts = await AccountModel.findAll({
                limit: limit,
                offset: offset,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                order: [['id', 'DESC']],
                where: { parent_account_id: account_id }
            });
            return {
                data: allAccounts ? allAccounts : [],
                total: count ? count : 0
            } as Paginated<AccountResponseModel>
        } catch (error: any) {
            console.log('este es el error de get all accounts');
            console.log(error);
            return {
                data: [],
                total: 0
            } as Paginated<AccountResponseModel>
        }
    }

    async update(account: UpdateAccountRequestModel): Promise<AccountResponseModel | DefaultResponse> {
        try {
            const data = {
                name: account.name,
                domain: account.domain,
                parent_account_id: account.parent_account_id
            }
            const new_account = await AccountModel.findByPk(account.id);
            if (!new_account) {
                return {message: 'Account not found'} as DefaultResponse;
            }
            const account_updated = await new_account.update(data);
            return {
                ...account_updated.dataValues
            } as AccountResponseModel
        } catch (error: any) {
            return {message: error.response.message} as DefaultResponse;
        }
    }

    async getAccountUserRelIds(user_id: string): Promise<AccountUserRelResponseModel[]> {
        try {
            return await AccountUserRelModel.findAll({
                limit: 1000,
                offset: 0,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                order: [['id', 'DESC']],
                where: { user_id: user_id },
            });
        } catch (error: any) {
            console.log('este es el error de get all accounts');
            console.log(error);
            return [];
        }
    }

    async getAccountsByUserId(user_id: string): Promise<AccountResponseModel[]> {
        try {
            return await AccountModel.findAll({
                limit: 1000,
                offset: 0,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                order: [['id', 'DESC']],
                include: [
                    {
                        model: UserModel,
                        as: 'users', // Aquí usa el alias correcto definido en la asociación
                        where: { id: user_id }, // Filtra por el `user_id`
                        attributes: [] // No necesitas atributos de la tabla intermedia
                    }
                ]
            });
        } catch (error: any) {
            console.log('este es el error de get all accounts');
            console.log(error);
            return [];
        }
    }

    async getById(account_id: number): Promise<AccountResponseModel | null> {
        try {
            return await AccountModel.findByPk(account_id);
        } catch (error: any) {
            console.log('este es el error de get all accounts');
            console.log(error);
            return null;
        }
    }

    async deleteAccountUserRelId(user_rel_id: number): Promise<string> {
        try {
            const toDestroy = await AccountUserRelModel.findByPk(user_rel_id);
            if(!toDestroy){
                return "Error: No se encontro"
            }
            toDestroy.destroy();
            return "OK" ;
        } catch (error: any) {
            const concatError = `Error: ${error}`;
            console.log('este es el error de get all accounts');
            console.log(error);
            return concatError;
        }
    }
}