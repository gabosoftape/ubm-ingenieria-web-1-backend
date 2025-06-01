import { IDefaultResponse } from "../../../domain/interfaces/common/i-default-response";
import { IBlogService } from "../../../domain/interfaces/services/i-blog-service";
import { IDeleteBlogCase } from "../../../domain/interfaces/use-cases/blog/i-delete-blog-case";

export class DeleteBlogUseCase implements IDeleteBlogCase {

    private blogService: IBlogService;

    constructor(blogService: IBlogService) {
        this.blogService = blogService;
    }

    async execute(blog_id: string): Promise<IDefaultResponse> {
        return await this.blogService.delete(blog_id) as IDefaultResponse;
    }
}