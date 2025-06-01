import {UserAttributes, UserCreationAttributes} from "../../../db/models/UserModel";
import {IDefaultResponse} from "../common/i-default-response";
import {IUserResponse, IUsersResponse} from "../../models/user";
import {AccountUserRelCreationAttributes} from "../../../db/models/AccountUserRelModel";
import {DefaultFilterCriteria} from "../common/default-filter-criteria";
import {UserRequestModel, UserResponseModel} from "../../models/user";
import {DefaultResponse} from "../common/default-response";
import {Paginated} from "../common/paginate";

export interface IUserRepository {
    create(user: UserCreationAttributes): Promise<UserAttributes>;
    getUserByPhone(phone: string): Promise<IUserResponse<UserAttributes | null>>
    getUserByEmail(email: string): Promise<IUserResponse<UserAttributes | null>>
    getAllUserByAccount(query: DefaultFilterCriteria, account_id: number): Promise<IUsersResponse<UserResponseModel>>
    createAccountUserRel(accountUserRel: AccountUserRelCreationAttributes): Promise<IDefaultResponse>
    update(user: UserRequestModel): Promise<UserResponseModel | DefaultResponse>;
    delete(user_id: string, account_id: number): Promise<DefaultResponse>;
    getAll(query: DefaultFilterCriteria): Promise<Paginated<UserResponseModel> | DefaultResponse>;
}