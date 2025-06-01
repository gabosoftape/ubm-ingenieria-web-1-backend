/**
 * @openapi
 * components:
 *   schemas:
 *     sendMessageOtpRequestModel:
 *       type: object
 *       required:
 *         - message
 *         - tpoa
 *         - recipient
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje OTP a enviar
 *         tpoa:
 *           type: string
 *           description: TPOA (Transmission Path Originating Address)
 *         recipient:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Recipient'
 *           description: Lista de destinatarios del mensaje OTP
 *
 *     Recipient:
 *       type: object
 *       required:
 *         - msisdn
 *       properties:
 *         msisdn:
 *           type: string
 *           description: Número de teléfono móvil del destinatario (Mobile Station International Subscriber Directory Number)
 *
 *     OtpServiceRequest:
 *       type: object
 *       required:
 *         - token
 *         - account_id
 *         - phone
 *       properties:
 *         token:
 *           type: string
 *           description: Token de autenticación
 *         account_id:
 *           type: integer
 *           format: int64
 *           description: ID de la cuenta asociada
 *         phone:
 *           type: string
 *           description: Número de teléfono del usuario
 *
 *     VerifyOtpRequest:
 *       type: object
 *       required:
 *         - otp
 *         - token
 *       properties:
 *         otp:
 *           type: string
 *           description: Código OTP ingresado por el usuario
 *         token:
 *           type: string
 *           description: Token de autenticación
 *
 *     RecaptchaRequest:
 *       type: object
 *       required:
 *         - tokenRecaptcha
 *       properties:
 *         tokenRecaptcha:
 *           type: string
 *           description: Token de reCAPTCHA para verificación
 */

export interface sendMessageOtpRequestModel {
    message: string;
    tpoa: string;
    recipient: Recipient[]
}

interface Recipient {
    msisdn: string;
}

export interface OtpServiceRequest {
    token: string;
    account_id: number;
    phone: string;
}

export interface VerifyOtpRequest {
    otp: string;
    token: string;
}

export interface RecaptchaRequest {
    tokenRecaptcha: string;
}