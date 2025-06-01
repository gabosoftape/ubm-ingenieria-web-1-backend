import {IDefaultResponse} from "../../common/i-default-response";
import {CreateBlogDto} from "../../../models/blog";

export interface ICreateBlogUseCase {
    execute(blog: CreateBlogDto, user_id: string): Promise<IDefaultResponse>;
}