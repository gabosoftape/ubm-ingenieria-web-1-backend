import {AccountRequestModel, AccountResponseModel, AssociateUserToAccountsRequestModel, UpdateAccountRequestModel} from "../../models/account";
import {DefaultResponse} from "../common/default-response";
import {DefaultFilterCriteria} from "../common/default-filter-criteria";
import {Paginated} from "../common/paginate";

export interface IAccountService {
    create(account: AccountRequestModel, user_id: string): Promise<AccountResponseModel | DefaultResponse>;
    update(account: UpdateAccountRequestModel): Promise<AccountResponseModel | DefaultResponse>;
    delete(account_id: number): Promise<DefaultResponse>;
    getAll(query: DefaultFilterCriteria, account_id: number): Promise<Paginated<AccountResponseModel> | DefaultResponse>;
    getSelfAvailableAccounts(user_id: string): Promise<Paginated<AccountResponseModel> | DefaultResponse>;
    associateUserToAccounts(data: AssociateUserToAccountsRequestModel): Promise<DefaultResponse>;
}