import {
    AccountRequestModel,
    AccountResponseModel,
    AccountUserRelResponseModel,
    UpdateAccountRequestModel
} from "../../models/account";
import {DefaultResponse} from "../common/default-response";
import {DefaultFilterCriteria} from "../common/default-filter-criteria";
import {Paginated} from "../common/paginate";

export interface IAccountRepository {
    create(account: AccountRequestModel): Promise<AccountResponseModel | DefaultResponse>;
    update(account: UpdateAccountRequestModel): Promise<AccountResponseModel | DefaultResponse>;
    delete(account_id: number): Promise<DefaultResponse>;
    getAll(query: DefaultFilterCriteria, account_id: number): Promise<Paginated<AccountResponseModel>>;
    getById(account_id: number): Promise<AccountResponseModel | null>;
    getAccountUserRelIds(user_id: string): Promise<AccountUserRelResponseModel[]>;
    getAccountsByUserId(user_id: string): Promise<AccountResponseModel[]>;
}