import {AuthService} from "../../services/auth-service";
import {LoginResponse } from "../../../domain/models/auth";
import { ILoginUseCase } from "../../../domain/interfaces/use-cases/auth/i-login-use-case";

export class LoginUseCase implements ILoginUseCase {

    private authService:AuthService;

    constructor(authService:AuthService) {
        this.authService = authService;
    }
    execute(email: string, password: string): Promise<LoginResponse> {
        return this.authService.login(email, password);
    }

   
}