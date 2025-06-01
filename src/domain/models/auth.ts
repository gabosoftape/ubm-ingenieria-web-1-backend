 import {UserResponseModel} from "./user";

/**
 * @openapi
 * components:
 *   schemas:
 *     VerifyUserByAccountRequest:
 *       type: object
 *       required:
 *         - phone
 *         - account_id
 *       properties:
 *         phone:
 *           type: string
 *           description: Número de teléfono del usuario
 *         account_id:
 *           type: integer
 *           format: int64
 *           description: ID de la cuenta asociada al usuario
 *
 *     VerifyUserByAccountResponse:
 *       type: object
 *       required:
 *         - status
 *         - message
 *         - token
 *       properties:
 *         status:
 *           type: integer
 *           description: Código de estado de la respuesta
 *         message:
 *           type: string
 *           description: Mensaje descriptivo de la respuesta
 *         token:
 *           type: string
 *           nullable: true
 *           description: Token de autenticación (puede ser nulo)
 *
 *     VerifyAuthTokenResponse:
 *       type: object
 *       required:
 *         - status
 *         - message
 *         - data
 *       properties:
 *         status:
 *           type: integer
 *           description: Código de estado de la respuesta
 *         message:
 *           type: string
 *           description: Mensaje descriptivo de la respuesta
 *         data:
 *           $ref: '#/components/schemas/UserAttributes'
 *           nullable: true
 *           description: Atributos del usuario (puede ser nulo)
 *
 *     UserAttributes:
 *       type: object
 *       description: Atributos del usuario
 *       # Nota: La estructura exacta de UserAttributes no está definida en el código proporcionado.
 *       # Deberías definir aquí las propiedades específicas de UserAttributes.
 */

export interface VerifyUserByAccountRequest {
    phone: string;
    account_id: number;
}

export interface VerifyUserByAccountResponse {
    status: number;
    message: string;
    token: string | null;
}

export interface VerifyAuthTokenResponse {
    status: number;
    message: string;
    data: UserResponseModel | null
}


export interface BaseUserResponse {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface RegisterUserRequest {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    phone: string;
}

export interface LoginResponse {
    status: number,
    token: string,
    message?: string,
    user: BaseUserResponse
}

export interface RegisterResponse {
    status: number,
    message: string,
    user?: BaseUserResponse
}

export interface UpdatePasswordResponse {
    status: number,
    message: string,
}