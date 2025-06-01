import {OtpServiceRequest, VerifyOtpRequest} from "../../models/otp";
import {IDefaultResponse} from "../common/i-default-response";

export interface IOtpService {
    sendMessageOtp(otpData: OtpServiceRequest): Promise<IDefaultResponse>;
    verifyOtp(otpData: VerifyOtpRequest):Promise<IDefaultResponse>;
    verifyRecaptcha(recaptcha: string):Promise<boolean>;
}