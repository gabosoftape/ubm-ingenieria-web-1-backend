import {VerifyAuthTokenResponse} from "../../../models/auth";

export interface IVerifyAuthTokenUseCase {
    execute(token: string): Promise<VerifyAuthTokenResponse>;
}