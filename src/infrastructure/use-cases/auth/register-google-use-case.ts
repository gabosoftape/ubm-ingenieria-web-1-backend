import {AuthService} from "../../services/auth-service";
import {RegisterResponse, GoogleRegisterRequest} from "../../../domain/models/auth";
import { IRegisterGoogleUseCase } from "../../../domain/interfaces/use-cases/auth/i-register-google-use-case";

export class RegisterGoogleUseCase implements IRegisterGoogleUseCase {

    private authService:AuthService;

    constructor(authService:AuthService) {
        this.authService = authService;
    }
    
    execute(googleData: GoogleRegisterRequest): Promise<RegisterResponse> {
        return this.authService.registerWithGoogle(googleData);
    }
} 