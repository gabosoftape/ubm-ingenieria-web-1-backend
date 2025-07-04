import {IAuthRepository} from "../../domain/interfaces/repositories/i-auth-repository";
import UserModel, {UserAttributes} from "../../db/models/UserModel";
import AccountUserRelModel, {AccountUserRelAttributes} from "../../db/models/AccountUserRelModel";
import { generateTokenAuth } from "../../config/jsonwebtoken";
import AuthEntity from "../../db/models/AuthModel";
import { LoginResponse, RegisterUserRequest, RegisterResponse, GoogleLoginRequest, GoogleRegisterRequest } from "../models/auth";
import { comparePassword, hashPassword } from "../../config/BcryptPassword";
import { v4 as uuidv4 } from 'uuid';

export class AuthRepository implements IAuthRepository {

    constructor() {
    }

    async verifyUserByPhone(phone: string): Promise<UserAttributes | null> {
        try {
            const user = await UserModel.findOne({
                where: {
                    phone: phone
                }
            });
            if (!user) {
                return null;
            }
            return user as UserAttributes;
        } catch (error) {
            throw error;
        }
    }

    async verifyAccountUserRel(account_id: number, user_id: string): Promise<AccountUserRelAttributes | null> {
        try {
            const accountUserRel = await AccountUserRelModel.findOne({
                where: {
                    account_id: account_id,
                    user_id: user_id
                }
            });
            if (!accountUserRel) {
                return null;
            }
            return accountUserRel as AccountUserRelAttributes;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(user_id: number): Promise<UserAttributes | null> {
        try {
            const user = await UserModel.findByPk(user_id);
            if (!user) {
                return null;
            }
            return {
                id: user.dataValues.id,
                phone: user.dataValues.phone,
                user_type: user.dataValues.user_type,
                name: user.dataValues.name,
                email: user.dataValues.email,
                identification: user.dataValues.identification
            } as UserAttributes;
        } catch (error) {
            throw error;
        }
    }

    
    async login(email: string, password: string ): Promise<LoginResponse> {
        try {
            const user = await UserModel.findOne({ where: { email } });
            if (!user) {
                return {
                    status: 401,
                    message: 'Credenciales inválidas',
                    token: '',
                    user: {
                        id: '',
                        email: '',
                        name: '',
                        role: ''
                    }
                }
            }

            const auth = await AuthEntity.findOne({ where: { user_id: user.id } });
            if (!auth) {
                return {
                    status: 401,
                    message: 'Credenciales inválidas',
                    token: '',
                    user: {
                        id: '',
                        email: '',
                        name: '',
                        role: ''
                    }
                }
            }

            const isValidPassword = await comparePassword(password, auth.password);
            if (!isValidPassword) {
                return {
                    status: 401,
                    message: 'Credenciales inválidas',
                    token: '',
                    user: {
                        id: '',
                        email: '',
                        name: '',
                        role: ''
                    }
                }
            }

            const token = generateTokenAuth({
                id: user.id,
                email: user.email,
                role: user.user_type || ''
            });

            return {
                status: 201,
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.user_type || ''
                }
            };
        } catch (error) {
            return {
                status: 401,
                message: 'Error en el servidor' + error,
                token: '',
                user: {
                    id: '',
                    email: '',
                    name: '',
                    role: ''
                }
            }
        }
    }

    async loginWithGoogle(googleData: GoogleLoginRequest): Promise<LoginResponse> {
        try {
            // Buscar usuario por email o google_uid
            const user = await UserModel.findOne({ 
                where: { 
                    email: googleData.email 
                } 
            });

            if (!user) {
                return {
                    status: 404,
                    message: 'Usuario no encontrado. Por favor regístrate primero.',
                    token: '',
                    user: {
                        id: '',
                        email: '',
                        name: '',
                        role: ''
                    }
                }
            }

            // Verificar que el usuario tenga autenticación de Google
            if (user.auth_provider !== 'google' && !user.google_uid) {
                return {
                    status: 401,
                    message: 'Este email está registrado con contraseña. Usa el login tradicional.',
                    token: '',
                    user: {
                        id: '',
                        email: '',
                        name: '',
                        role: ''
                    }
                }
            }

            // Si el usuario existe pero no tiene google_uid, actualizarlo
            if (!user.google_uid) {
                await user.update({
                    google_uid: googleData.google_uid,
                    photo_url: googleData.photo_url,
                    auth_provider: 'google'
                });
            }

            const token = generateTokenAuth({
                id: user.id,
                email: user.email,
                role: user.user_type || ''
            });

            return {
                status: 201,
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.user_type || ''
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: 'Error en el servidor: ' + error,
                token: '',
                user: {
                    id: '',
                    email: '',
                    name: '',
                    role: ''
                }
            }
        }
    }

    async register(new_user: RegisterUserRequest): Promise<RegisterResponse> {
        try {
                  
            // Verificar si el usuario ya existe
        
            const existingUser = await UserModel.findOne({ where: {  email: new_user.email } });
            if (existingUser) {
                return {
                    status: 401,
                    message: 'El email ya está registrado',
                    user: {
                        id: '',
                        email: '',
                        name: '',
                        role: ''
                    }
                }
            }
            
            const new_data = {
                id: new_user.id,
                name: new_user.name,
                email: new_user.email,
                identification: '',
                phone: new_user.phone,
                user_type: new_user.role,
                auth_provider: 'local'
            } 
            // Crear usuario
            const user = await UserModel.create(new_data);

            // Crear auth
            const hashedPassword = await hashPassword(new_user.password);
            await AuthEntity.create({
              password: hashedPassword,
              user_id: user.id
            });

            // creamos user rel basica, con account 1
            await AccountUserRelModel.create({
                account_id: 1,
                user_id: user.id,
            })
            return {
                status: 201,
                message: 'Usuario registrado exitosamente',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.user_type || 'unknown'
                }
            }
          } catch (error) {
            console.error(error);
            return {
                status: 500,
                message: 'Error en el servidor' + error ,
                user: {
                    id: '',
                    email: '',
                    name: '',
                    role: ''
                }
            }
          }
    }

    async registerWithGoogle(googleData: GoogleRegisterRequest): Promise<RegisterResponse> {
        try {
            // Verificar si el usuario ya existe
            const existingUser = await UserModel.findOne({ 
                where: { 
                    email: googleData.email 
                } 
            });
            
            if (existingUser) {
                return {
                    status: 401,
                    message: 'El email ya está registrado',
                    user: {
                        id: '',
                        email: '',
                        name: '',
                        role: ''
                    }
                }
            }
            
            const new_data = {
                id: uuidv4(),
                name: googleData.name,
                email: googleData.email,
                identification: '',
                phone: googleData.phone,
                user_type: googleData.role,
                google_uid: googleData.google_uid,
                photo_url: googleData.photo_url,
                auth_provider: 'google'
            } 
            
            // Crear usuario
            const user = await UserModel.create(new_data);

            // creamos user rel basica, con account 1
            await AccountUserRelModel.create({
                account_id: 1,
                user_id: user.id,
            })
            
            return {
                status: 201,
                message: 'Usuario registrado exitosamente con Google',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.user_type || 'unknown'
                }
            }
        } catch (error) {
            return {
                status: 500,
                message: 'Error en el servidor: ' + error,
                user: {
                    id: '',
                    email: '',
                    name: '',
                    role: ''
                }
            }
        }
    }

    async updatePassword(userId: string, hashedPassword: string): Promise<boolean> {
        try {
            const auth = await AuthEntity.findOne({ where: { user_id: userId } });
            if (!auth) {
                return false;
            }

            await auth.update({ password: hashedPassword });
            return true;
        } catch (error) {
            throw error;
        }
    }
}