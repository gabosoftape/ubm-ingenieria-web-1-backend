import {UpdatePasswordResponse, VerifyAuthTokenResponse, VerifyUserByAccountRequest, VerifyUserByAccountResponse, LoginResponse, RegisterResponse, RegisterUserRequest, GoogleLoginRequest, GoogleRegisterRequest} from "../../models/auth";


export interface IAuthService {
    verifyUserByPhone(auth: VerifyUserByAccountRequest): Promise<VerifyUserByAccountResponse>;
    verifyAuthToken(token: string): Promise<VerifyAuthTokenResponse>;
    login(email: string, password: string): Promise<LoginResponse>;
    register(user: RegisterUserRequest): Promise<RegisterResponse>;
    loginWithGoogle(googleData: GoogleLoginRequest): Promise<LoginResponse>;
    registerWithGoogle(googleData: GoogleRegisterRequest): Promise<RegisterResponse>;
    updatePassword(userId: string, password: string): Promise<UpdatePasswordResponse>;
}