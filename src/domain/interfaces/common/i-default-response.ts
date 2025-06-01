/**
 * @openapi
 * components:
 *   schemas:
 *     IDefaultResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           description: Numero de estado
 *         message:
 *           type: string
 *           description: Mensaje de respuesta
 */


export interface IDefaultResponse {
    status: number;
    message: string;
}

export interface IDefaultResponseDTO<T> {
    status: number;
    message: string;
    data: T;
}