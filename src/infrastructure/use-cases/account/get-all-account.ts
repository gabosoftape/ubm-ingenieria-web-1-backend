import {DefaultResponse} from "../../../domain/interfaces/common/default-response";
import {IGetAllAccountCase} from "../../../domain/interfaces/use-cases/accounts/i-get-all-account-case";
import {DefaultFilterCriteria} from "../../../domain/interfaces/common/default-filter-criteria";
import {Paginated} from "../../../domain/interfaces/common/paginate";
import {AccountResponseModel} from "../../../domain/models/account";
import { IAccountService } from "../../../domain/interfaces/services/i-account-service";

export class GetAllAccount implements IGetAllAccountCase {

    private accountService: IAccountService;

    constructor(accountService: IAccountService) {
        this.accountService = accountService;
    }

    execute(query: DefaultFilterCriteria, account_id: number): Promise<Paginated<AccountResponseModel> | DefaultResponse> {
        return this.accountService.getAll(query, account_id);
    }
}