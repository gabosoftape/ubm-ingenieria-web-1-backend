import {IDefaultResponse} from "../../common/i-default-response";

export interface IDeleteBlogCase {
    execute(blog_id: string, account_id: number): Promise<IDefaultResponse>
}