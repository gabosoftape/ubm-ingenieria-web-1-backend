import {EditUserDto, EditUserResponseDto} from "../../../domain/models/user";
import {UserService} from "../../services/user-service";
import {IUpdateUserCase} from "../../../domain/interfaces/use-cases/user/i-update-user-case";
import {DefaultResponse} from "../../../domain/interfaces/common/default-response";
import { IUserService } from "../../../domain/interfaces/services/i-user-service";

export class UpdateUser implements IUpdateUserCase {

    private userService: IUserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    execute(user: EditUserDto, user_id: string): Promise<EditUserResponseDto | DefaultResponse>{
        return this.userService.update(user, user_id);
    }
}