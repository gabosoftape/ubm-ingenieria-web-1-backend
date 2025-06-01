import {Paginated} from "../../common/paginate";
import {DefaultResponse} from "../../common/default-response";
import {AccountResponseModel} from "../../../models/account";

export interface IGetSelfAvailableAccountsCase {
    execute(user_id: string): Promise<Paginated<AccountResponseModel> | DefaultResponse>
}