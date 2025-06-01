import {DefaultResponse} from "../../common/default-response";
import {AssociateUserToAccountsRequestModel} from "../../../models/account";

export interface IAssociateUserToAccountsUseCase {
    execute(data: AssociateUserToAccountsRequestModel): Promise<DefaultResponse>
}