import {ICreateUserUseCase} from "../../../domain/interfaces/use-cases/user/i-create-user-use-case";
import {IDefaultResponse} from "../../../domain/interfaces/common/i-default-response";
import {CreateUserDto} from "../../../domain/models/user";
import { IUserService } from "../../../domain/interfaces/services/i-user-service";

export class CreateUser implements ICreateUserUseCase {

    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    execute(user: CreateUserDto, user_id: string): Promise<IDefaultResponse> {
        return this.userService.create(user, user_id);
    }


}