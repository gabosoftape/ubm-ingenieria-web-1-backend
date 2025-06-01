import {AccountResponseModel, UpdateAccountRequestModel} from "../../../domain/models/account";
import {AccountService} from "../../services/account-service";
import {IUpdateAccountCase} from "../../../domain/interfaces/use-cases/accounts/i-update-account-case";
import {DefaultResponse} from "../../../domain/interfaces/common/default-response";

export class UpdateAccount implements IUpdateAccountCase {

    private accountService: AccountService;

    constructor(accountService: AccountService) {
        this.accountService = accountService;
    }

    execute(account: UpdateAccountRequestModel): Promise<AccountResponseModel | DefaultResponse> {
        return this.accountService.update(account);
    }
}