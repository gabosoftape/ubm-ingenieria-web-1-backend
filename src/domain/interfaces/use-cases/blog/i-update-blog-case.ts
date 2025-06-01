import {DefaultResponse} from "../../common/default-response";
import {EditBlogDto, EditBlogResponseDto} from "../../../models/blog";

export interface IUpdateBlogCase {
    execute(blog: EditBlogDto, user_id: string): Promise<EditBlogResponseDto | DefaultResponse>
}