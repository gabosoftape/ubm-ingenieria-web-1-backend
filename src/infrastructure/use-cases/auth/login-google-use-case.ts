import {AuthService} from "../../services/auth-service";
import {LoginResponse, GoogleLoginRequest} from "../../../domain/models/auth";
import { ILoginGoogleUseCase } from "../../../domain/interfaces/use-cases/auth/i-login-google-use-case";

export class LoginGoogleUseCase implements ILoginGoogleUseCase {

    private authService:AuthService;

    constructor(authService:AuthService) {
        this.authService = authService;
    }
    
    execute(googleData: GoogleLoginRequest): Promise<LoginResponse> {
        return this.authService.loginWithGoogle(googleData);
    }
} 