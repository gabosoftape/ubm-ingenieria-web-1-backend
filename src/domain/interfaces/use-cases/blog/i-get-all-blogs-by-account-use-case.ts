import {DefaultFilterCriteria} from "../../common/default-filter-criteria";
import {BlogResponseModel, IBlogsResponse} from "../../../models/blog";

export interface IGetAllBlogsByAccountUseCase {
    execute(query: DefaultFilterCriteria, account_id: number): Promise<IBlogsResponse<BlogResponseModel>>;
}