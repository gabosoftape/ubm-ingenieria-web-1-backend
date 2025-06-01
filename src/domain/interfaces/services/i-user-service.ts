import {IDefaultResponse} from "../common/i-default-response";
import {DefaultFilterCriteria} from "../common/default-filter-criteria";
import {
    CreateUserDto,
    EditUserDto,
    EditUserResponseDto,
    IUserResponse,
    IUsersResponse
} from "../../models/user";
import {UserResponseModel} from "../../models/user";
import {DefaultResponse} from "../common/default-response";
import {Paginated} from "../common/paginate";
import { UserAttributes } from "../../../db/models/UserModel";

export interface IUserService {
    create(user: CreateUserDto, user_id: string): Promise<IDefaultResponse>;
    getUserByEmail(email: string): Promise<IUserResponse<UserAttributes | null>>
    getAllUserByAccount(query: DefaultFilterCriteria, account_id: number): Promise<IUsersResponse<UserResponseModel>>;
    update(user: EditUserDto, user_id: string): Promise<EditUserResponseDto | DefaultResponse>;
    delete(user_id: string, account_id: number): Promise<DefaultResponse>;
    getAll(query: DefaultFilterCriteria): Promise<Paginated<UserResponseModel> | DefaultResponse>;
}