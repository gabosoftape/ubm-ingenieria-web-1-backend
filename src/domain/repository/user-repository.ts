import {IUserRepository} from "../../domain/interfaces/repositories/i-user-repository";
import UserModel, {UserAttributes, UserCreationAttributes} from "../../db/models/UserModel";
import {IDefaultResponse} from "../../domain/interfaces/common/i-default-response";
import {IUserResponse, IUsersResponse} from "../../domain/models/user";
import AccountUserRelModel, {AccountUserRelCreationAttributes} from "../../db/models/AccountUserRelModel";
import {DefaultFilterCriteria} from "../../domain/interfaces/common/default-filter-criteria";
import AccountModel from "../../db/models/AccountModel";
import {DefaultResponse} from "../../domain/interfaces/common/default-response";
import {Paginated} from "../../domain/interfaces/common/paginate";
import {UserRequestModel, UserResponseModel} from "../../domain/models/user";


export class UserRepository implements IUserRepository {

    constructor() {
    }

    async create(user: UserCreationAttributes): Promise<UserAttributes> {
        try {
            const new_user = await UserModel.create(user);
            return {...new_user.dataValues} as UserAttributes;
        } catch (error) {
            throw error;
        }
    }

    async getUserByPhone(phone: string): Promise<IUserResponse<UserAttributes | null>> {
        try {
            const user = await UserModel.findOne({
                where: {
                    phone: phone
                }
            });
            if (!user) {
                return {
                    status: 404,
                    message: 'User not found',
                    data: null
                } as IUserResponse<UserAttributes | null>
            }
            return {
                status: 200,
                message: 'search successful',
                data: user
            } as IUserResponse<UserAttributes | null>
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<IUserResponse<UserAttributes | null>> {
        try {
            const user = await UserModel.findOne({
                where: {
                    email: email
                }
            });
            if (!user) {
                return {
                    status: 404,
                    message: 'User not found',
                    data: null
                } as IUserResponse<UserAttributes | null>
            }
            return {
                status: 200,
                message: 'search successful',
                data: user
            } as IUserResponse<UserAttributes | null>
        } catch (error) {
            throw error;
        }
    }

    async getAllUserByAccount(query: DefaultFilterCriteria, account_id: number): Promise<IUsersResponse<UserResponseModel>> {
        try {
            const limit = query.pageSize ? +query.pageSize : 50;
            const offset = query.page && query.pageSize ? +query.page * +query.pageSize : 0;
            const count = await UserModel.count({
                include: [
                    {
                        model: AccountModel,
                        as: 'accounts',
                        where: {id: account_id},
                        through: {
                            attributes: []
                        }
                    }
                ]
            });
            const allUsers = await UserModel.findAll({
                limit: limit,
                offset: offset,
                include: [
                    {
                        model: AccountModel,
                        as: 'accounts',
                        where: {id: account_id},
                        through: {
                            attributes: []
                        }
                    }
                ],
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                order: [['id', 'DESC']]
            });
            return {
                status: 200,
                message: `users related to the account ${account_id}`,
                data: allUsers ? allUsers.map((r => r.toJSON())) : [],
                count: count ? count : 0
            } as IUsersResponse<UserResponseModel>
        } catch (error) {
            console.info("Este es el error en el repositorio", error);
            throw error;
        }
    }

    async createAccountUserRel(accountUserRel: AccountUserRelCreationAttributes): Promise<IDefaultResponse> {
        try {
            const new_account_user_rel = await AccountUserRelModel.create(accountUserRel);
            return {
                status: 200,
                message: `user ${new_account_user_rel.dataValues.user_id} and account ${new_account_user_rel.dataValues.account_id} relationship created successfully`
            } as IDefaultResponse;
        } catch (error) {
            throw error;
        }
    }


    async delete(user_id: string, account_id: number): Promise<DefaultResponse> {
        try {
            const account_user_rels = await AccountUserRelModel.findAll({
                where: { user_id: user_id}
            });
            console.log("account_user_rels in delete repo", account_user_rels);
            if(account_user_rels.length == 1) {
                const user = await UserModel.findByPk(user_id);
                if (!user) {
                    return {message: 'User not found'} as DefaultResponse;
                } else {
                    await user.destroy();
                    return {message: 'User deleted'} as DefaultResponse;
                }
            }
            if(account_user_rels.length > 1) {
                //
                const account_to_destroy = account_user_rels.filter((account_rel)=> account_rel.dataValues.account_id == account_id);
                const accountData = await AccountUserRelModel.findByPk(account_to_destroy[0].dataValues.id);
                accountData?.destroy();
                return {message: 'User rel accounts associated deleted'} as DefaultResponse;
            }
            return {message: 'User has accounts associated'} as DefaultResponse;
        } catch (error:any) {
            return {message: error.response.message} as DefaultResponse;
        }
    }

    async getAll(query: DefaultFilterCriteria): Promise<Paginated<UserResponseModel> | DefaultResponse> {
        try {
            const limit = query.pageSize ? +query.pageSize : 50;
            const offset = query.page && query.pageSize ? +query.page * +query.pageSize : 0;
            const count = await UserModel.count();
            const allUsers = await UserModel.findAll({
                limit: limit,
                offset: offset,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                order: [['id', 'DESC']]
            });
            return {
                data: allUsers ? allUsers : [],
                total: count ? count : 0
            } as Paginated<UserResponseModel>
        } catch (error: any) {
            console.log('este es el error de get all users');
            console.log(error);
            return {message: error.response.message} as DefaultResponse;
        }
    }

    async update(user: UserRequestModel): Promise<UserResponseModel | DefaultResponse> {
        try {
            const data = {
                name: user.name,
                email: user.email,
                identification: user.identification,
                phone: user.phone,
                user_type: user.user_type,
            }
            console.info("ID de usuario en metodo update en repositorio de usuarios", user.id, data);
            const new_user = await UserModel.findByPk(user.id);
            if (!new_user) {
                return {message: 'User not found'} as DefaultResponse;
            }
            const user_updated = await new_user.update(data);
            return {
                ...user_updated.dataValues
            } as UserResponseModel
        } catch (error: any) {
            return {message: error.response.message} as DefaultResponse;
        }
    }
}