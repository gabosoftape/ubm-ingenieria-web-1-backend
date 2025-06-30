import { LoginResponse, RegisterUserRequest, RegisterResponse, GoogleLoginRequest, GoogleRegisterRequest } from "../../models/auth";
import { UserAttributes } from "../../../db/models/UserModel";
import {AccountUserRelAttributes} from "../../../db/models/AccountUserRelModel";

export interface IAuthRepository {
    verifyUserByPhone(phone: string): Promise<UserAttributes | null>;
    verifyAccountUserRel(account_id: number, user_id: string): Promise<AccountUserRelAttributes | null>;
    getUserById(user_id: number): Promise<UserAttributes | null>;
    login(email: string, password: string): Promise<LoginResponse>;
    loginWithGoogle(googleData: GoogleLoginRequest): Promise<LoginResponse>;
    register(new_user: RegisterUserRequest): Promise<RegisterResponse>;
    registerWithGoogle(googleData: GoogleRegisterRequest): Promise<RegisterResponse>;
    updatePassword(userId: string, hashedPassword: string): Promise<boolean>;
}