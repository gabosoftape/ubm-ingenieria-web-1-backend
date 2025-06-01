import {UserService} from "../../services/user-service";
import {UserAttributes} from "../../../db/models/UserModel";
import {IUserResponse} from "../../../domain/models/user";
import { IGetUserByEmailUseCase } from "../../../domain/interfaces/use-cases/user/i-get-user-by-email-use-case";

export class GetUserByEmail implements IGetUserByEmailUseCase {

    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async execute(email: string): Promise<IUserResponse<UserAttributes>> {
        const user = await this.userService.getUserByEmail(email) as IUserResponse<UserAttributes>;
        if (!user) {
            return {
                status: 404,
                message: 'noting found',
                data: {
                    id: "0",
                    phone: "",
                    user_type: "",
                    role_id: 0,
                    email: "",
                    identification: "",
                    name: ""
                }
            } as IUserResponse<UserAttributes>;
        }
        return user;

    }


}