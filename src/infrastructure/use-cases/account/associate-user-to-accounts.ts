import {AccountService} from "../../services/account-service";
import {DefaultResponse} from "../../../domain/interfaces/common/default-response";
import {AssociateUserToAccountsRequestModel} from "../../../domain/models/account";
import { IAssociateUserToAccountsUseCase } from "../../../domain/interfaces/use-cases/accounts/i-associate-user-to-accounts-case";

export class AssociateUserToAccountsUseCase implements IAssociateUserToAccountsUseCase {

    private accountService: AccountService;

    constructor(accountService: AccountService) {
        this.accountService = accountService;
    }

    execute(data: AssociateUserToAccountsRequestModel ): Promise<DefaultResponse> {
        return this.accountService.associateUserToAccounts(data);
    }
}