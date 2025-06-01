import {UserAttributes} from "../../../../db/models/UserModel";
import {IUserResponse} from "../../../models/user";

export interface IGetUserByPhoneUseCase {
    execute(phone: string): Promise<IUserResponse<UserAttributes>>;
}