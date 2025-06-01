import {DefaultResponse} from "../../common/default-response";

export interface IDeleteAccountCase {
    execute(account_id: number): Promise<DefaultResponse>
}