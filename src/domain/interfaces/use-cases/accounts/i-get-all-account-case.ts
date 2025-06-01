import {AccountResponseModel} from "../../../models/account";
import {DefaultFilterCriteria} from "../../common/default-filter-criteria";
import {Paginated} from "../../common/paginate";
import {DefaultResponse} from "../../common/default-response";

export interface IGetAllAccountCase {
    execute(query: DefaultFilterCriteria, account_id: number): Promise<Paginated<AccountResponseModel> | DefaultResponse>
}