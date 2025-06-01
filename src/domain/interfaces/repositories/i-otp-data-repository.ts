import {sendMessageOtpRequestModel, VerifyOtpRequest} from "../../models/otp";
import {OtpDataAttributes, OtpDataCreationAttributes} from "../../../db/models/OtpDataModel";

export interface IOtpDataRepository {
    sendMessageOtp(otpData: sendMessageOtpRequestModel): Promise<any>;
    createOtp(otp: OtpDataCreationAttributes): Promise<OtpDataAttributes>;
    verifyOtp(otpData: VerifyOtpRequest):Promise<OtpDataAttributes | null>;
    verifyRecaptcha(recaptcha: string):Promise<boolean>;
}