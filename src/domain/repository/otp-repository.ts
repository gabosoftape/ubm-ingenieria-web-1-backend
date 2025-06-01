import {IOtpDataRepository} from "../../domain/interfaces/repositories/i-otp-data-repository";
import {sendMessageOtpRequestModel, VerifyOtpRequest} from "../../domain/models/otp";
import axios from "axios";
import OtpDataModel, {OtpDataAttributes, OtpDataCreationAttributes} from "../../db/models/OtpDataModel";

export class OtpRepository implements IOtpDataRepository {

    constructor() {
    }

    async sendMessageOtp(otpData: sendMessageOtpRequestModel): Promise<any> {
        try {
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.labsmobile.com/json/send',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(`${process.env.LABSMOBILE_EMAIL}:${process.env.LABSMOBILE_KEY}`).toString('base64')
                },
                data : otpData
            }
            const  response = await axios.request(config);
            return response.data
        } catch (error) {
            console.error('Error al crear producto');
            console.error(error);
            throw error;
        }
    }

    async createOtp(otp: OtpDataCreationAttributes): Promise<OtpDataAttributes> {
        try {
            const new_otp = await OtpDataModel.create(otp);
            return {...new_otp} as OtpDataAttributes;
        } catch (error) {
            throw error;
        }
    }

    async verifyOtp(otpData: VerifyOtpRequest): Promise<OtpDataAttributes | null> {
        try {
            const otp = await OtpDataModel.findOne({
                where: {
                    otp: otpData.otp,
                    token: otpData.token,
                    status: true
                }
            });
            if (otp) {
                return otp as OtpDataAttributes;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    async verifyRecaptcha(recaptcha: string): Promise<boolean> {
        try {
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_KEY}&response=${recaptcha}`,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            const  response = await axios.request(config);
            return response.data.success as boolean
        } catch (error) {
            throw error;
        }
    }
}