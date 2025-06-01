import {UserService} from "../../services/user-service";
import {IGetAllUsersByAccountUseCase} from "../../../domain/interfaces/use-cases/user/i-get-all-users-by-account-use-case";
import {DefaultFilterCriteria} from "../../../domain/interfaces/common/default-filter-criteria";
import { IUsersResponse, UserResponseModel} from "../../../domain/models/user";

export class GetAllUsersByAccount implements IGetAllUsersByAccountUseCase {

    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    execute(query: DefaultFilterCriteria, account_id: number): Promise<IUsersResponse<UserResponseModel>> {
        return this.userService.getAllUserByAccount(query, account_id);
    }


}