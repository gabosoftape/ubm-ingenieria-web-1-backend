import {LoginResponse} from "../../../models/auth";
import {GoogleLoginRequest} from "../../../models/auth";

export interface ILoginGoogleUseCase {
    execute(googleData: GoogleLoginRequest): Promise<LoginResponse>;
} 