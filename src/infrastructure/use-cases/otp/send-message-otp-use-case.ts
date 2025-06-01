import {ISendMessageOtpUseCase} from "../../../domain/interfaces/use-cases/otp/i-send-message-otp-use-case";
import {OtpService} from "../../services/otp-service";
import {OtpServiceRequest} from "../../../domain/models/otp";
import {IDefaultResponse} from "../../../domain/interfaces/common/i-default-response";

export class SendMessageOtpUseCase implements ISendMessageOtpUseCase {

    private otpService: OtpService;

    constructor(otpService: OtpService) {
        this.otpService = otpService;
    }

    execute(otpData: OtpServiceRequest): Promise<IDefaultResponse> {
        return this.otpService.sendMessageOtp(otpData);
    }

}