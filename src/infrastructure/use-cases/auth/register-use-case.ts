import {AuthService} from "../../services/auth-service";
import {RegisterResponse, RegisterUserRequest} from "../../../domain/models/auth";
import { IRegisterUseCase } from "../../../domain/interfaces/use-cases/auth/i-register-use-case";

export class RegisterUseCase implements IRegisterUseCase {

    private authService:AuthService;

    constructor(authService:AuthService) {
        this.authService = authService;
    }

    execute(user: RegisterUserRequest): Promise<RegisterResponse> {
        return this.authService.register(user);
    }
}