import {ICreateAccountCase} from "../../../domain/interfaces/use-cases/accounts/i-create-account-case";
import {AccountRequestModel, AccountResponseModel} from "../../../domain/models/account";
import {AccountService} from "../../services/account-service";
import {DefaultResponse} from "../../../domain/interfaces/common/default-response";

export class CreateAccount implements ICreateAccountCase {

    private accountService: AccountService;

    constructor(accountService: AccountService) {
        this.accountService = accountService;
    }

    execute(account: AccountRequestModel, user_id: string): Promise<AccountResponseModel | DefaultResponse> {
        return this.accountService.create(account, user_id);
    }
}