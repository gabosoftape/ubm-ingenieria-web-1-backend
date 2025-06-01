import {UserService} from "../../services/user-service";
import {UserAttributes} from "../../../db/models/UserModel";
import {IUserResponse} from "../../../domain/models/user";
import {IGetUserByPhoneUseCase} from "../../../domain/interfaces/use-cases/user/i-get-user-by-phone-use-case";

export class GetUserByPhone implements IGetUserByPhoneUseCase {

    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async execute(phone: string): Promise<IUserResponse<UserAttributes>> {
        const user = await this.userService.getUserByPhone(phone) as IUserResponse<UserAttributes>;
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