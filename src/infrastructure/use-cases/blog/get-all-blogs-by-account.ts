import {DefaultFilterCriteria} from "../../../domain/interfaces/common/default-filter-criteria";
import { IBlogService } from "../../../domain/interfaces/services/i-blog-service";
import { IGetAllBlogsByAccountUseCase } from "../../../domain/interfaces/use-cases/blog/i-get-all-blogs-by-account-use-case";
import { BlogResponseModel, IBlogsResponse } from "../../../domain/models/blog";

export class GetAllBlogsByAccountUseCase implements IGetAllBlogsByAccountUseCase {

    private blogService: IBlogService;

    constructor(blogService: IBlogService) {
        this.blogService = blogService;
    }

    execute(query: DefaultFilterCriteria, account_id: number): Promise<IBlogsResponse<BlogResponseModel>> {
        return this.blogService.getAllBlogsByAccount(query, account_id);
    }


}