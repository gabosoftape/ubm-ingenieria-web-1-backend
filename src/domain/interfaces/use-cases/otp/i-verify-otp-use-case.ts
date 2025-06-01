import {VerifyOtpRequest} from "../../../models/otp";
import {IDefaultResponse} from "../../common/i-default-response";

export interface IVerifyOtpUseCase {
    execute(otpData: VerifyOtpRequest):Promise<IDefaultResponse>;
}