import {OtpServiceRequest} from "../../../models/otp";
import {IDefaultResponse} from "../../common/i-default-response";

export interface ISendMessageOtpUseCase {
    execute(otpData: OtpServiceRequest): Promise<IDefaultResponse>;
}