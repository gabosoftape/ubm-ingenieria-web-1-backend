import {AccountResponseModel, UpdateAccountRequestModel} from "../../../models/account";
import {DefaultResponse} from "../../common/default-response";

export interface IUpdateAccountCase {
    execute(account: UpdateAccountRequestModel): Promise<AccountResponseModel | DefaultResponse>
}