import {AccountRequestModel, AccountResponseModel} from "../../../models/account";
import {DefaultResponse} from "../../common/default-response";

export interface ICreateAccountCase {
    execute(account: AccountRequestModel, user_id: string): Promise<AccountResponseModel | DefaultResponse>;
}