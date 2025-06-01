import { IVerifyAuthTokenUseCase } from "../../../domain/interfaces/use-cases/auth/i-verify-auth-token-use-case";
import { VerifyAuthTokenResponse } from "../../../domain/models/auth";
import {AuthService} from "../../services/auth-service";


export class VerifyAuthTokenCaseUse implements IVerifyAuthTokenUseCase {

    private authService:AuthService;

    constructor(authService:AuthService) {
        this.authService = authService;
    }

    async execute(token: string): Promise<VerifyAuthTokenResponse> {
        return await this.authService.verifyAuthToken(token);
    }
}