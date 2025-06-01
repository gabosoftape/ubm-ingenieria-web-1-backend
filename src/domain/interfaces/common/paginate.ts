/**
 * @openapi
 * components:
 *   schemas:
 *     Paginated:
 *       type: object
 *       required:
 *         - data
 *         - total
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GenericItem'
 *           description: Array de elementos paginados
 *         total:
 *           type: integer
 *           format: int64
 *           minimum: 0
 *           description: Número total de elementos disponibles
 *
 *     GenericItem:
 *       type: object
 *       description: Representa un elemento genérico. Reemplazar con el esquema específico cuando se use.
 */

export interface Paginated<T> {
    data: T[];
    total: number;
}