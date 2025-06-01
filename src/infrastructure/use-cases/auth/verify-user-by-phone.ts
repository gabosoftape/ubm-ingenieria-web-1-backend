import {IVerifyUserByAccountUseCase} from "../../../domain/interfaces/use-cases/auth/i-verify-user-by-account-use-case";
import {AuthService} from "../../services/auth-service";
import {VerifyUserByAccountRequest, VerifyUserByAccountResponse} from "../../../domain/models/auth";

export class VerifyUserByPhone implements IVerifyUserByAccountUseCase {

    private authService:AuthService;

    constructor(authService:AuthService) {
        this.authService = authService;
    }

    execute(auth: VerifyUserByAccountRequest): Promise<VerifyUserByAccountResponse> {
        return this.authService.verifyUserByPhone(auth);
    }
}