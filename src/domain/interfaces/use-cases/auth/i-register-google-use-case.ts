import {RegisterResponse} from "../../../models/auth";
import {GoogleRegisterRequest} from "../../../models/auth";

export interface IRegisterGoogleUseCase {
    execute(googleData: GoogleRegisterRequest): Promise<RegisterResponse>;
} 