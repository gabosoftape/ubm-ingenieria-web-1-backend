import {IDefaultResponse} from "../../common/i-default-response";

export interface IDeleteBlogCase {
    execute(blog_id: string): Promise<IDefaultResponse>
}