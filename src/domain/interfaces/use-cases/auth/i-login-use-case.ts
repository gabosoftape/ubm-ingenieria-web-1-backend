import {LoginResponse} from "../../../models/auth";

export interface ILoginUseCase {
    execute( email: string, password: string ): Promise<LoginResponse>;
}