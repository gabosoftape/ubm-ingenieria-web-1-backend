import {IAuthService} from "../../domain/interfaces/services/i-auth-service";

import {LoginResponse, RegisterResponse, RegisterUserRequest, UpdatePasswordResponse, VerifyAuthTokenResponse, VerifyUserByAccountRequest, VerifyUserByAccountResponse, GoogleLoginRequest, GoogleRegisterRequest} from "../../domain/models/auth";
import {IUserToken} from "../../domain/models/user";
import {generateTokenAuth, verifyTokenAuth} from "../../config/jsonwebtoken";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { hashPassword } from "../../config/BcryptPassword";


export class AuthService implements IAuthService {

    private authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    async verifyUserByPhone(auth: VerifyUserByAccountRequest): Promise<VerifyUserByAccountResponse> {
        try {
            const verify_user = await this.authRepository.verifyUserByPhone(auth.phone);
            if (!verify_user) {
                return {
                    status: 404,
                    message: 'user not found',
                    token: null
                } as VerifyUserByAccountResponse;
            }
            const verify_account_user_rel = await this.authRepository.verifyAccountUserRel(auth.account_id, verify_user.id);
            if (!verify_account_user_rel) {
                return {
                    status: 404,
                    message: 'account user rel not found',
                    token: null
                } as VerifyUserByAccountResponse;
            }
            const tokenData: IUserToken = {
                id: verify_user.id,
                email: verify_user.email || '',
                role: verify_user.user_type || '',
            }
            const token = generateTokenAuth(tokenData);
            return {
                status: 200,
                message: 'token',
                token: token
            } as VerifyUserByAccountResponse;
        } catch (error) {
            throw error;
        }
    }

    async verifyAuthToken(token: string): Promise<VerifyAuthTokenResponse> {
        try {
            const verifyTokenData = verifyTokenAuth(token);
            if (typeof verifyTokenData === "string") {
                return {
                    status:401,
                    message: 'El token ha expirado',
                    data: null
                } as VerifyAuthTokenResponse;
            }
            if (!verifyTokenData) {
                return {
                    status:403,
                    message: 'Token inválido',
                    data: null
                } as VerifyAuthTokenResponse;
            }
            const user_id = verifyTokenData.id;
            const user = await this.authRepository.getUserById(user_id);
            if (!user) {
                return {
                    status:404,
                    message: 'User not found',
                    data: null
                } as VerifyAuthTokenResponse;
            }
            return {
                status:200,
                message: 'ok',
                data: user
            } as VerifyAuthTokenResponse;
        } catch (error) {
            throw error;
        }
    }

    
    async login( email: string, password: string ): Promise<LoginResponse> {
        try {
            const login = await this.authRepository.login(email, password);
            if (!login) {
                return {
                    status:404,
                    message: 'User not found',
                    token: '',
                    user: {
                        id: '',
                        email: '',
                        name: '',
                        role: ''
                    }
                } as LoginResponse;
            }
            return login;
        } catch (error) {
            throw error;
        }
    }

    async loginWithGoogle(googleData: GoogleLoginRequest): Promise<LoginResponse> {
        try {
            const login = await this.authRepository.loginWithGoogle(googleData);
            if (!login) {
                return {
                    status:404,
                    message: 'User not found',
                    token: '',
                    user: {
                        id: '',
                        email: '',
                        name: '',
                        role: ''
                    }
                } as LoginResponse;
            }
            return login;
        } catch (error) {
            throw error;
        }
    }

    async register(user: RegisterUserRequest): Promise<RegisterResponse> {
        try {
            const register = await this.authRepository.register(user);
            if (!register) {
                return {
                    status:404,
                    message: 'User not found',
                    token: '',
                    user: {
                        id: '',
                        email: '',
                        name: '',
                        role: ''
                    }
                } as RegisterResponse;
            }
            return register;
        } catch (error) {
            throw error;
        }
    }

    async registerWithGoogle(googleData: GoogleRegisterRequest): Promise<RegisterResponse> {
        try {
            const register = await this.authRepository.registerWithGoogle(googleData);
            if (!register) {
                return {
                    status:404,
                    message: 'User not found',
                    token: '',
                    user: {
                        id: '',
                        email: '',
                        name: '',
                        role: ''
                    }
                } as RegisterResponse;
            }
            return register;
        } catch (error) {
            throw error;
        }
    }

    async updatePassword(userId: string, password: string): Promise<UpdatePasswordResponse>{
        try {
            const hashedPassword = await hashPassword(password);
            const result = await this.authRepository.updatePassword(userId, hashedPassword);
            
            if (!result) {
                return {
                    status: 404,
                    message: 'Usuario no encontrado'
                };
            }

            return {
                status: 200,
                message: 'Contraseña actualizada exitosamente'
            };
        } catch (error) {
            return {
                status: 500,
                message: 'Error al actualizar la contraseña: ' + error
            };
        }
    }
}
