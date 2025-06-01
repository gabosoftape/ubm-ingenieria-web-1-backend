import {EditUserDto, EditUserResponseDto} from "../../../models/user";
import {DefaultResponse} from "../../common/default-response";

export interface IUpdateUserCase {
    execute(user: EditUserDto, user_id: string): Promise<EditUserResponseDto | DefaultResponse>
}