import {IAccountService} from "../../domain/interfaces/services/i-account-service";
import {
    AccountRequestModel,
    AccountResponseModel,
    AssociateUserToAccountsRequestModel,
    UpdateAccountRequestModel
} from "../../domain/models/account";
import {DefaultResponse} from "../../domain/interfaces/common/default-response";
import {DefaultFilterCriteria} from "../../domain/interfaces/common/default-filter-criteria";
import {Paginated} from "../../domain/interfaces/common/paginate";
import {AccountRepository} from "../../domain/repository/account-repository";
import {UserRepository} from "../../domain/repository/user-repository";

export class AccountService implements IAccountService {

    private accountRepository: AccountRepository;
    private userRepository: UserRepository;

    constructor(accountRepository: AccountRepository, userRepository: UserRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    async create(account: AccountRequestModel, user_id: string): Promise<AccountResponseModel | DefaultResponse> {
        const account_ids = await this.accountRepository.getAccountUserRelIds(user_id);
        if(account_ids.length > 0 ){
            console.log("acccount ids lenght", account_ids.length);
            account.parent_account_id = account_ids[0].account_id;
            console.log("acccount id", account_ids[0].account_id);
        }else{
            console.log("lenght zero", account_ids);
        }
        const newAccount = await this.accountRepository.create(account);
        // make Account Ruser rel
        console.log("typeof new Account", typeof newAccount)
        if("id" in newAccount){
            let res = await this.userRepository.createAccountUserRel({user_id: user_id, account_id: newAccount.id})
            console.log(res)
        }
        return newAccount
    }

    async update(account: UpdateAccountRequestModel): Promise<AccountResponseModel | DefaultResponse> {
        return await this.accountRepository.update(account);
    }

    async delete(account_id: number): Promise<DefaultResponse> {
        return await this.accountRepository.delete(account_id);
    }

    async getAll(query: DefaultFilterCriteria, account_id: number): Promise<Paginated<AccountResponseModel> | DefaultResponse> {
        return await this.accountRepository.getAll(query, account_id);
    }
    async getSelfAvailableAccounts(user_id: string): Promise<Paginated<AccountResponseModel> | DefaultResponse>  {
        const accounts = await this.accountRepository.getAccountsByUserId(user_id);
        return {
            data: accounts,
            total: accounts.length
        }
    }
    async associateUserToAccounts(data: AssociateUserToAccountsRequestModel): Promise<DefaultResponse>  {
        const account_rels = await this.accountRepository.getAccountUserRelIds(data.user_id);
        let account_ids = account_rels.map((account_rel) =>  account_rel.account_id);
        // si toca crear... 
        let not_found_ids = [];
        if(account_ids.length > 0 ){
            console.log("acccount ids lenght", account_ids.length);
            not_found_ids = data.accounts.filter(elemento => !account_ids.includes(elemento));
        }else{
            console.log("lenght zero", account_ids);
            not_found_ids = data.accounts;
        }
        console.log("new acccount ids lenght", not_found_ids.length);
        // make Account Ruser rel
        not_found_ids.forEach((account_id) => {
            this.userRepository.createAccountUserRel({user_id: data.user_id, account_id: account_id}).then((res)=> {
                console.log("res -> creation id: ", account_id, res);
            })
        });    
        let toDeleteIds = account_ids.filter(elemento => !data.accounts.includes(elemento));
        let accounts_to_delete = account_rels.filter((account_rel) =>  account_rel.account_id in toDeleteIds);
        // si toca borrar
        console.log(accounts_to_delete);
        
        accounts_to_delete.forEach((account)=> {
            let res = this.accountRepository.deleteAccountUserRelId(account.id!);
            console.log(res);
        })
        return {
            message: "OK"
        }
    }
}