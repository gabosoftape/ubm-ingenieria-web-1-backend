import {AccountService} from "../../services/account-service";
import {DefaultResponse} from "../../../domain/interfaces/common/default-response";
import {Paginated} from "../../../domain/interfaces/common/paginate";
import {AccountResponseModel} from "../../../domain/models/account";
import {IGetSelfAvailableAccountsCase} from "../../../domain/interfaces/use-cases/accounts/i-get-self-available-accounts-case";

export class GetSelfAvailableAccounts implements IGetSelfAvailableAccountsCase {

    private accountService: AccountService;

    constructor(accountService: AccountService) {
        this.accountService = accountService;
    }

    execute(user_id: string): Promise<Paginated<AccountResponseModel> | DefaultResponse> {
        return this.accountService.getSelfAvailableAccounts(user_id);
    }
}