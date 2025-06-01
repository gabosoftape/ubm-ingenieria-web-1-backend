import {IUserService} from "../../domain/interfaces/services/i-user-service";
import {UserAttributes} from "../../db/models/UserModel";
import {IDefaultResponse} from "../../domain/interfaces/common/i-default-response";
import {
    CreateUserDto,
    EditUserDto,
    EditUserResponseDto,
    IUserResponse,
    IUsersResponse, UserRequestModel
} from "../../domain/models/user";
import {AccountUserRelCreationAttributes} from "../../db/models/AccountUserRelModel";
import {DefaultFilterCriteria} from "../../domain/interfaces/common/default-filter-criteria";
import {UserResponseModel} from "../../domain/models/user";
import {DefaultResponse} from "../../domain/interfaces/common/default-response";
import {Paginated} from "../../domain/interfaces/common/paginate";
import { IUserRepository } from "../../domain/interfaces/repositories/i-user-repository";
import { IAccountRepository } from "../../domain/interfaces/repositories/i-account-repository";

export class UserService implements IUserService {

    private userRepository: IUserRepository;
    private accountRepository: IAccountRepository;

    constructor(userRepository: IUserRepository, accountRepository: IAccountRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    async create(user: CreateUserDto, user_id: string): Promise<IDefaultResponse> {
        console.log(user_id);
        console.log("User ", user);
        const account_ids = await this.accountRepository.getAccountUserRelIds(user_id);
        let accountsArray = account_ids.map((rel) => rel.account_id);
        console.log("accounts array", accountsArray);
        if(!accountsArray.includes(user.account_id)){
            return {
                status: 409,
                message: 'You do not have permission to use this account'
            } as IDefaultResponse;
        }
        const verify_user = await this.getUserByPhone(user.phone);
        if (verify_user.status === 200) {
            return {
                status: 409,
                message: 'User with this phone number already exists'
            } as IDefaultResponse;
        }
        const new_user = await this.userRepository.create(user);
        await this.createAccountUserRel({
            user_id: new_user.id,
            account_id: user.account_id
        });
        return {
            status: 200,
            message: 'user created and related to account'
        } as IDefaultResponse;
    }

    async getUserByPhone(phone: string): Promise<IUserResponse<UserAttributes | null>> {
        return await this.userRepository.getUserByPhone(phone);
    }

    async getUserByEmail(email: string): Promise<IUserResponse<UserAttributes | null>> {
        return await this.userRepository.getUserByEmail(email);
    }

    async getAllUserByAccount(query: DefaultFilterCriteria, account_id: number): Promise<IUsersResponse<UserResponseModel>> {
        // const account_ids = await this.accountRepository.getAccountUserRelIds(user_id);
        
        const users = await this.userRepository.getAllUserByAccount(query, account_id);
        // Añadir el account_id a cada usuario antes de agregarlos a usersData
        console.log("aqui usuarios", users);
        return users;
    }

    async createAccountUserRel(accountUserRel: AccountUserRelCreationAttributes): Promise<IDefaultResponse> {
        return await this.userRepository.createAccountUserRel(accountUserRel);
    }

    async update(user: EditUserDto, user_id: string): Promise<EditUserResponseDto | DefaultResponse> {
        const account_rels = await this.accountRepository.getAccountUserRelIds(user_id);
        let account_ids = account_rels.map((account_rel) =>  account_rel.account_id);
        if(user.account_id !in account_ids ){
            // creamos una nueva relacion, y elimamos la anterior.
            await this.createAccountUserRel({
                user_id: user.id,
                account_id: user.account_id
            });
        }
        const dataUserUpdated = await this.userRepository.update(user as UserRequestModel);
        return {
            ...dataUserUpdated,
            account_id: user.account_id
        }


    }

    async delete(user_id: string, account_id: number): Promise<DefaultResponse> {
        return await this.userRepository.delete(user_id, account_id);
    }

    async getAll(query: DefaultFilterCriteria): Promise<Paginated<UserResponseModel> | DefaultResponse> {
        return await this.userRepository.getAll(query);
    }

}