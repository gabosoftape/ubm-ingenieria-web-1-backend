import {DefaultFilterCriteria} from "../common/default-filter-criteria";
import {DefaultResponse} from "../common/default-response";
import {BlogResponseModel, EditBlogDto, EditBlogResponseDto, IBlogsResponse} from "../../models/blog";
import {BlogAttributes, BlogCreationAttributes} from "../../../db/models/BlogModel";

export interface IBlogRepository {
    create(blog: BlogCreationAttributes): Promise<BlogAttributes>;
    getAllBlogsByAccount(query: DefaultFilterCriteria, account_id: number): Promise<IBlogsResponse<BlogResponseModel>> ;
    update(blog: EditBlogDto, user_id: string): Promise<EditBlogResponseDto | DefaultResponse>;
    delete(blog_id: string): Promise<DefaultResponse>;
}