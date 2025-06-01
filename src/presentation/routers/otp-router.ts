import {SendMessageOtpUseCase} from "../../infrastructure/use-cases/otp/send-message-otp-use-case";
import express from "express";
import { Request, Response } from 'express';
import {VerifyOtpUseCase} from "../../infrastructure/use-cases/otp/verify-otp-use-case";
import {VerifyRecaptchaUseCase} from "../../infrastructure/use-cases/otp/verify-recaptcha-use-case";
import {RecaptchaRequest} from "../../domain/models/otp";

export default function OtpRouter(
    sendMessageOtp: SendMessageOtpUseCase,
    verifyOtpUseCase: VerifyOtpUseCase,
    verifyRecaptchaUseCase: VerifyRecaptchaUseCase
) {
    const router = express.Router();

    // send message otp
    router.post('/sendMessageOtp', async (req:Request, res: Response) => {
        try {
            const response = await sendMessageOtp.execute(req.body);
            res.status(response.status).send(response);
        } catch (error: any) {
            console.log('este es el error al enviar el codito otp');
            console.error(error);
            res.status(500).send({
                message: error.parent.detail ? error.parent.detail : 'Internal server error',
                error: error
            });
        }
    });

    router.post('/verifyOtp', async (req:Request, res:Response) => {
        try {
            const response = await verifyOtpUseCase.execute(req.body);
            res.status(response.status).send(response);
        } catch (error: any) {
            console.log('este es el error al verificar el codigo otp');
            console.error(error);
            res.status(500).send({
                message: error.parent.detail ? error.parent.detail : 'Internal server error',
                error: error
            });
        }
    });

    router.post('/verifyRecaptcha', async (req: Request, res: Response) => {
        try {
            const data: RecaptchaRequest = req.body;
            console.log('este el dato del recaptcha que llega del cliente');
            console.log(data);
            const response = await verifyRecaptchaUseCase.execute(data.tokenRecaptcha);
            res.status(200).send({
                message: 'Recaptcha ok',
                data: response
            });
        } catch (error: any) {
            console.log('este es el error al verificar el recaptcha');
            console.error(error);
            res.status(500).send({
                message: error.parent.detail ? error.parent.detail : 'Internal server error',
                error: error
            });
        }
    });

    return router;
}