import { DefaultResponse } from "../../common/default-response";

export interface IUpdateUserPasswordUseCase {
    execute(userId: string, password: string): Promise<DefaultResponse>;
} 