import {IDefaultResponse} from "../../domain/interfaces/common/i-default-response";
import {DefaultFilterCriteria} from "../../domain/interfaces/common/default-filter-criteria";
import {DefaultResponse} from "../../domain/interfaces/common/default-response";
import { IAccountRepository } from "../../domain/interfaces/repositories/i-account-repository";
import { IBlogService } from "../../domain/interfaces/services/i-blog-service";
import { IBlogRepository } from "../../domain/interfaces/repositories/i-blog-repository";
import { BlogResponseModel, CreateBlogDto, EditBlogDto, EditBlogResponseDto, IBlogsResponse } from "../../domain/models/blog";

export class BlogService implements IBlogService {

    private blogRepository: IBlogRepository;
    private accountRepository: IAccountRepository;

    constructor(blogRepository: IBlogRepository, accountRepository: IAccountRepository) {
        this.blogRepository = blogRepository;
        this.accountRepository = accountRepository;
    }

    async create(blog: CreateBlogDto, user_id: string): Promise<IDefaultResponse> {
        console.log(user_id);
        console.log("blog ", blog);
        const account_ids = await this.accountRepository.getAccountUserRelIds(user_id);
        let accountsArray = account_ids.map((rel) => rel.account_id);
        console.log("accounts array", accountsArray);
        if(!accountsArray.includes(blog.account_id)){
            return {
                status: 409,
                message: 'You do not have permission to use this account'
            } as IDefaultResponse;
        }
        await this.blogRepository.create(blog);
        return {
            status: 200,
            message: 'blog created and related to account'
        } as IDefaultResponse;
    }


    async getAllBlogsByAccount(query: DefaultFilterCriteria, account_id: number): Promise<IBlogsResponse<BlogResponseModel>> {
               
        const blogs = await this.blogRepository.getAllBlogsByAccount(query, account_id);
        console.log("aqui blogs", blogs);
        return blogs;
    }

    async update(blog: EditBlogDto, user_id: string): Promise<EditBlogResponseDto | DefaultResponse> {
        const dataBlogUpdated = await this.blogRepository.update(blog, user_id);
        return {
            ...dataBlogUpdated,
            account_id: blog.account_id
        }


    }

    async delete(blog_id: string): Promise<DefaultResponse> {
        return await this.blogRepository.delete(blog_id);
    }

}