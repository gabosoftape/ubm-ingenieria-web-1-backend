import {UserService} from "../../services/user-service";
import {DefaultResponse} from "../../../domain/interfaces/common/default-response";
import {IDeleteUserCase} from "../../../domain/interfaces/use-cases/user/i-delete-user-case";

export class DeleteUser implements IDeleteUserCase {

    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async execute(user_id: string, account_id: number): Promise<DefaultResponse> {
        return await this.userService.delete(user_id, account_id);
    }
}