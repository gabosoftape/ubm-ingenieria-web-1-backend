import {OtpService} from "../../services/otp-service";
import {IVerifyRecaptchaUseCase} from "../../../domain/interfaces/use-cases/otp/i-verify-recaptcha-use-case";

export class VerifyRecaptchaUseCase implements IVerifyRecaptchaUseCase {

    private otpService: OtpService;

    constructor(otpService: OtpService) {
        this.otpService = otpService;
    }

    async execute(recaptcha: string): Promise<boolean> {
        return await this.otpService.verifyRecaptcha(recaptcha);
    }

}