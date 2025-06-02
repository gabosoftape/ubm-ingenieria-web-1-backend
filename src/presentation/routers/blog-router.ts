import express from "express";
import { Request, Response } from 'express';
import {DefaultFilterCriteria} from "../../domain/interfaces/common/default-filter-criteria";
import {IGetAuthTokenRequest} from "../../middlewares/authentication";
import { ICreateBlogUseCase } from "../../domain/interfaces/use-cases/blog/i-create-blog-use-case";
import { IGetAllBlogsByAccountUseCase } from "../../domain/interfaces/use-cases/blog/i-get-all-blogs-by-account-use-case";
import { IUpdateBlogCase } from "../../domain/interfaces/use-cases/blog/i-update-blog-case";
import { IDeleteBlogCase } from "../../domain/interfaces/use-cases/blog/i-delete-blog-case";
import { EditBlogDto } from "../../domain/models/blog";

export default function BlogsRouter(
    createBlogUseCase: ICreateBlogUseCase,
    getAllBlogsByAccountUseCase: IGetAllBlogsByAccountUseCase,
    updateBlogUseCase: IUpdateBlogCase,
    deleteBlogUseCase: IDeleteBlogCase
) {
    const router = express.Router();
    /**
     * @openapi
     * /api/v1/blogs/create:
     *   post:
     *     summary: Crea un nuevo blog
     *     tags: [Blogs]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateBlogDto'
     *     responses:
     *       200:
     *         description: Blog creado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BlogResponseModel'
     *       500:
     *         description: Error del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: error fetching data
     */

    // create blog
    router.post('/create', async (req: Request, res: Response) => {
        try {
            let user_id = (req as IGetAuthTokenRequest).authUserId;
            console.log(user_id);
            const new_account = await createBlogUseCase.execute(req.body, user_id);
            return res.status(new_account.status).send(new_account);
        } catch (error) {
            console.log('este es el error al crear un blog');
            console.error(error);
            return res.status(500).send({
                message: 'internal server error',
                error: error
            });
        }
    });

    /**
     * @openapi
     * /api/v1/blogs/all:
     *   get:
     *     summary: Obtiene todos los blogs
     *     tags: [Blogs]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Número de página para la paginación
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Número de elementos por página
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *         description: Campo por el cual ordenar los resultados
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *         description: Orden de clasificación (ascendente o descendente)
     *     responses:
     *       200:
     *         description: Lista de blogs obtenida exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 page:
     *                   type: string
     *                 pageSize:
     *                   type: string
     *       500:
     *         description: Error del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */

    router.get('/all', async (req: Request, res: Response) => {
        try {
            let user_email = (req as IGetAuthTokenRequest).authEmail;
            let user_id = (req as IGetAuthTokenRequest).authUserId;
            console.log(user_id);
            console.log(user_email);
            const account_id = parseInt(req.query.account_id as string);
            console.log("account_id",account_id);
            const all_blogs = await getAllBlogsByAccountUseCase.execute(req.query as unknown as DefaultFilterCriteria, account_id);
            return res.status(200).send(all_blogs);
        } catch (error) {
            console.log('este es el error al obtener los blogs');
            console.error(error);
            return res.status(500).send({
                message: 'internal server error',
                error: error
            });
        }
    });

    /**
     * @openapi
     * /api/v1/blogs/update:
     *   put:
     *     summary: Actualiza un blog existente
     *     tags: [Blogs]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/EditBlogDto'
     *     responses:
     *       200:
     *         description: Blog actualizado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/EditBlogResponseDto'
     *       500:
     *         description: Error del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    
    // update blog
    router.put('/update', async (req:Request, res: Response) => {
        try {
            const blog: EditBlogDto = req.body;
            let user_id = (req as IGetAuthTokenRequest).authUserId;
            const data = await updateBlogUseCase.execute(blog, user_id);
            return res.send(data);
        } catch (error) {
            return res.status(500).send({
                message: 'error fetching data'
            });
        }
    });

    /**
     * @openapi
     * /api/v1/blogs/delete/{blog_id}:
     *   delete:
     *     summary: Elimina un blog
     *     tags: [Blogs]
     *     parameters:
     *       - in: path
     *         name: blog_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del blog a eliminar
     *     responses:
     *       200:
     *         description: Blog eliminado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *       500:
     *         description: Error del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */


    // delete user
    router.delete('/delete/:blog_id', async (req:Request, res: Response) => {
        try {
            const data = await deleteBlogUseCase.execute(req.params.blog_id);
            res.send(data);
        } catch (error) {
            res.status(500).send({
                message: 'error fetching data'
            });
        }
    });
    return router;
}