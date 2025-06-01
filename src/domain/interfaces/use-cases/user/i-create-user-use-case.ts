import {IDefaultResponse} from "../../common/i-default-response";
import {CreateUserDto} from "../../../models/user";

export interface ICreateUserUseCase {
    execute(user: CreateUserDto, user_id: string): Promise<IDefaultResponse>;
}