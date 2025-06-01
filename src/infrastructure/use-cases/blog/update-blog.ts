import {EditBlogDto, EditBlogResponseDto} from "../../../domain/models/blog";
import {IUpdateBlogCase} from "../../../domain/interfaces/use-cases/blog/i-update-blog-case";
import {DefaultResponse} from "../../../domain/interfaces/common/default-response";
import { IBlogService } from "../../../domain/interfaces/services/i-blog-service";

export class UpdateBlogUseCase implements IUpdateBlogCase {

    private blogService: IBlogService;

    constructor(blogService: IBlogService) {
        this.blogService = blogService;
    }

    execute(blog: EditBlogDto, user_id: string): Promise<EditBlogResponseDto | DefaultResponse>{
        return this.blogService.update(blog, user_id);
    }
}