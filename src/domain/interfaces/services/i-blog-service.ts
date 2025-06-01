import {IDefaultResponse} from "../common/i-default-response";
import {DefaultFilterCriteria} from "../common/default-filter-criteria";
import {DefaultResponse} from "../common/default-response";
import {BlogResponseModel, CreateBlogDto, EditBlogDto, EditBlogResponseDto, IBlogsResponse} from "../../models/blog";

export interface IBlogService {
    create(blog: CreateBlogDto, user_id: string): Promise<IDefaultResponse>;
    getAllBlogsByAccount(query: DefaultFilterCriteria, account_id: number): Promise<IBlogsResponse<BlogResponseModel>>;
    update(blog: EditBlogDto, user_id: string): Promise<EditBlogResponseDto | DefaultResponse>;
    delete(blog_id: string): Promise<DefaultResponse>;
}