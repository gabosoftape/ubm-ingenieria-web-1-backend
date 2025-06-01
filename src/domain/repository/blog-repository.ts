import {DefaultFilterCriteria} from "../../domain/interfaces/common/default-filter-criteria";
import {DefaultResponse} from "../../domain/interfaces/common/default-response";
import {IBlogRepository} from "../interfaces/repositories/i-blog-repository";
import BlogModel, {BlogAttributes, BlogCreationAttributes} from "../../db/models/BlogModel";
import {BlogRequestModel, BlogResponseModel, IBlogsResponse} from "../models/blog";


export class BlogRepository implements IBlogRepository {

    constructor() {
    }

    async create(blog: BlogCreationAttributes): Promise<BlogAttributes> {
        try {
            const new_blog = await BlogModel.create(blog);
            return {...new_blog.dataValues} as BlogAttributes;
        } catch (error) {
            throw error;
        }
    }

    async getAllBlogsByAccount(query: DefaultFilterCriteria, account_id: number): Promise<IBlogsResponse<BlogResponseModel>> {
        try {
            const limit = query.pageSize ? +query.pageSize : 50;
            const offset = query.page && query.pageSize ? +query.page * +query.pageSize : 0;
            const count = await BlogModel.count({
                where: { account_id: account_id }
            });
            const allBlogs = await BlogModel.findAll({
                limit: limit,
                offset: offset,
                where: { account_id: account_id },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                order: [['id', 'DESC']]
            });
            return {
                status: 200,
                message: `blogs related to the account ${account_id}`,
                data: allBlogs ? allBlogs.map((r => r.toJSON())) : [],
                count: count ? count : 0
            } as IBlogsResponse<BlogResponseModel>
        } catch (error) {
            console.info("Este es el error en el repositorio de blogs", error);
            throw error;
        }
    }

    async delete(blog_id: string): Promise<DefaultResponse> {
        try {
            const blog = await BlogModel.findByPk(blog_id);
            if (!blog) {
                return {message: 'Blog not found'} as DefaultResponse;
            }
            await blog.destroy();
            return {message: 'Blog deleted'} as DefaultResponse;

        } catch (error:any) {
            return {message: error.response.message} as DefaultResponse;
        }
    }

    async update(blog: BlogRequestModel): Promise<BlogResponseModel | DefaultResponse> {
        try {
            const data = {
                name: blog.name,
                description: blog.description,
                text: blog.text,
                account_id: blog.account_id
            }
            console.info("ID de blog en metodo update en repositorio de blogs", blog.id, data);
            const new_blog = await BlogModel.findByPk(blog.id);
            if (!new_blog) {
                return {message: 'Blog not found'} as DefaultResponse;
            }
            const blog_updated = await new_blog.update(data);
            return {
                ...blog_updated.dataValues
            } as BlogResponseModel
        } catch (error: any) {
            return {message: error.response.message} as DefaultResponse;
        }
    }
}