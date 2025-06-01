import {DefaultResponse} from "../../common/default-response";

export interface IDeleteUserCase {
    execute(user_id: string, account_id: number): Promise<DefaultResponse>
}