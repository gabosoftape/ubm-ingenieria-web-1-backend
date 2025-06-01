import {DefaultFilterCriteria} from "../../common/default-filter-criteria";
import { IUsersResponse, UserResponseModel} from "../../../models/user";

export interface IGetAllUsersByAccountUseCase {
    execute(query: DefaultFilterCriteria, account_id: number): Promise<IUsersResponse<UserResponseModel>>;
}