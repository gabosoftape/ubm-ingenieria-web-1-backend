/**
 * @openapi
 * components:
 *   schemas:
 *     DefaultFilterCriteria:
 *       type: object
 *       properties:
 *         page:
 *           type: string
 *           description: Número de página para la paginación
 *         pageSize:
 *           type: string
 *           description: Número de elementos por página
 */

import { IAuthDataRequest } from "../../../middlewares/authentication";

export interface DefaultFilterCriteria {
    page?: string;
    pageSize?: string;
    dataAuth?: IAuthDataRequest
}