import {UserAttributes} from "../../../../db/models/UserModel";
import {IUserResponse} from "../../../models/user";

export interface IGetUserByEmailUseCase {
    execute(email: string): Promise<IUserResponse<UserAttributes>>;
}