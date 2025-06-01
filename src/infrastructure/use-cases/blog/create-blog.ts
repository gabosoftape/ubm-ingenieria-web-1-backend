import {IDefaultResponse} from "../../../domain/interfaces/common/i-default-response";
import {CreateBlogDto} from "../../../domain/models/blog";
import { IBlogService } from "../../../domain/interfaces/services/i-blog-service";
import {ICreateBlogUseCase} from "../../../domain/interfaces/use-cases/blog/i-create-blog-use-case";

export class CreateBlogUseCase implements ICreateBlogUseCase {

    private blogService: IBlogService;

    constructor(blogService: IBlogService) {
        this.blogService = blogService;
    }

    execute(blog: CreateBlogDto, user_id: string): Promise<IDefaultResponse> {
        return this.blogService.create(blog, user_id);
    }


}