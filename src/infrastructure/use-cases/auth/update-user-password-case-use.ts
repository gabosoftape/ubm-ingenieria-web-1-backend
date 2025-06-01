import { IUpdateUserPasswordUseCase } from "../../../domain/interfaces/use-cases/auth/i-update-user-password-use-case";

import { DefaultResponse } from "../../../domain/interfaces/common/default-response";
import { IAuthService } from "../../../domain/interfaces/services/i-auth-service";

export class UpdateUserPasswordUseCase implements IUpdateUserPasswordUseCase {
    constructor(private authService: IAuthService) {}

    async execute(userId: string, password: string): Promise<DefaultResponse> {
        return this.authService.updatePassword(userId, password) as unknown as DefaultResponse;        
    }
} 