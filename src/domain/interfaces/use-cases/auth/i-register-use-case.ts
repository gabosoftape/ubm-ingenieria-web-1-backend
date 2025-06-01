import {RegisterResponse, RegisterUserRequest} from "../../../models/auth";

export interface IRegisterUseCase {
    execute(user: RegisterUserRequest): Promise<RegisterResponse>;
}