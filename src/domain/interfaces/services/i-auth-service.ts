import {UpdatePasswordResponse, VerifyAuthTokenResponse, VerifyUserByAccountRequest, VerifyUserByAccountResponse} from "../../models/auth";


export interface IAuthService {
    verifyUserByPhone(auth: VerifyUserByAccountRequest): Promise<VerifyUserByAccountResponse>;
    verifyAuthToken(token: string): Promise<VerifyAuthTokenResponse>;
    updatePassword(userId: string, password: string): Promise<UpdatePasswordResponse>;
}