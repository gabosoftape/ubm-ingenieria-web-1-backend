/**
 * @openapi
 * components:
 *   schemas:
 *     DefaultResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje de respuesta
 */

export interface DefaultResponse {
    status?: number;
    message: string;
}