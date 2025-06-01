import {AccountService} from "../../services/account-service";
import {DefaultResponse} from "../../../domain/interfaces/common/default-response";
import {IDeleteAccountCase} from "../../../domain/interfaces/use-cases/accounts/i-delete-account-case";

export class DeleteAccount implements IDeleteAccountCase {

    private accountService: AccountService;

    constructor(accountService: AccountService) {
        this.accountService = accountService;
    }

    execute(account_id: number): Promise<DefaultResponse> {
        return this.accountService.delete(account_id);
    }
}