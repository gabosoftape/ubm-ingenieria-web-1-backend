import {IOtpService} from "../../domain/interfaces/services/i-otp-service";
import {OtpRepository} from "../../domain/repository/otp-repository";
import {OtpServiceRequest, VerifyOtpRequest} from "../../domain/models/otp";
import {IDefaultResponse} from "../../domain/interfaces/common/i-default-response";
import {generateOtpNumber} from "../../utils/generateOtpNumber";
import {generateCurrentDateInSeconds} from "../../utils/generateCurrentDateInSeconds";
import {addMinutesInSeconds} from "../../utils/addMinutesInSeconds";

export class OtpService implements IOtpService {

    private otpRepository: OtpRepository;

    constructor(otpRepository: OtpRepository) {
        this.otpRepository = otpRepository;
    }

    async sendMessageOtp(otpData: OtpServiceRequest): Promise<IDefaultResponse> {
        try {
            const otpCode = generateOtpNumber(6);
            const currentTimeInSeconds = generateCurrentDateInSeconds();
            const expirationTimeInSeconds = addMinutesInSeconds(currentTimeInSeconds, 10);
            await this.otpRepository.createOtp({
                otp: otpCode,
                token: otpData.token,
                create_date: currentTimeInSeconds,
                end_date: expirationTimeInSeconds,
                status: true
            });
            await this.otpRepository.sendMessageOtp({
                message: `${otpCode} otp code DC`,
                tpoa: 'Sender',
                recipient: [
                    {
                        msisdn: otpData.phone
                    }
                ]
            });
            return {
                status: 200,
                message: 'Opt enviado a tu celular'
            }
        } catch (error) {
            throw error;
        }
    }

    async verifyOtp(otpData: VerifyOtpRequest): Promise<IDefaultResponse> {
        try {
            const verifyOtp = await this.otpRepository.verifyOtp(otpData);
            if (!verifyOtp) {
                return {
                    status: 404,
                    message: 'Otp not found'
                } as IDefaultResponse;
            }
            return {
                status: 200,
                message: 'Otp ok'
            } as IDefaultResponse;
        } catch (error) {
            throw error;
        }
    }

    async verifyRecaptcha(recaptcha: string): Promise<boolean> {
        try {
            return await this.otpRepository.verifyRecaptcha(recaptcha);
        } catch (error) {
            throw error;
        }
    }
}