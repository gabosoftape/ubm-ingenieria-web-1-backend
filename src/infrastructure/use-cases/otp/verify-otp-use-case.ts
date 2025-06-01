import {IVerifyOtpUseCase} from "../../../domain/interfaces/use-cases/otp/i-verify-otp-use-case";
import {OtpService} from "../../services/otp-service";
import {VerifyOtpRequest} from "../../../domain/models/otp";
import {IDefaultResponse} from "../../../domain/interfaces/common/i-default-response";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {

    private otpService: OtpService;

    constructor(otpService: OtpService) {
        this.otpService = otpService;
    }

    execute(otpData: VerifyOtpRequest): Promise<IDefaultResponse> {
        return this.otpService.verifyOtp(otpData);
    }

}