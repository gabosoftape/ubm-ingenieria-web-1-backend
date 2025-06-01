import {VerifyUserByAccountRequest, VerifyUserByAccountResponse} from "../../../models/auth";

export interface IVerifyUserByAccountUseCase {
    execute(auth: VerifyUserByAccountRequest): Promise<VerifyUserByAccountResponse>;
}