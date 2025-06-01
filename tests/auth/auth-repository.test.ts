import { AuthRepository } from '../../src/domain/repository/auth-repository';
import UserModel, { UserAttributes } from '../../src/db/models/UserModel';
import AuthEntity, { AuthAttributes } from '../../src/db/models/AuthModel';
import { comparePassword, hashPassword } from '../../src/config/BcryptPassword';
import { generateTokenAuth } from '../../src/config/jsonwebtoken';
import { beforeAll, afterAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RegisterUserRequest } from '../../src/domain/models/auth';
import { Model } from 'sequelize';

// Mock de los módulos
jest.mock('../../src/db/models/UserModel');
jest.mock('../../src/db/models/AuthModel');
jest.mock('../../src/config/BcryptPassword');
jest.mock('../../src/config/jsonwebtoken');

// Tipos para los mocks
const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockAuthModel = AuthEntity as jest.Mocked<typeof AuthEntity>;
const mockComparePassword = comparePassword as jest.MockedFunction<typeof comparePassword>;
const mockHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>;
const mockGenerateToken = generateTokenAuth as jest.MockedFunction<typeof generateTokenAuth>;

// Helper para crear mocks de modelos Sequelize
const createMockModel = <T extends object>(data: T): Model<T> => ({
    ...data,
    _attributes: data,
    dataValues: data,
    _creationAttributes: data,
    isNewRecord: false,
    toJSON: () => data,
} as unknown as Model<T>);

describe('AuthRepository', () => {
    let repository: AuthRepository;

    beforeEach(() => {
        repository = new AuthRepository();
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('debería iniciar sesión exitosamente con credenciales válidas', async () => {
            // Arrange
            const email = 'test@example.com';
            const password = 'password123';
            const hashedPassword = 'hashedPassword123';
            const mockUserData: Partial<UserAttributes> = {
                id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                user_type: 'user'
            };
            const mockAuthData: Partial<AuthAttributes> = {
                password: hashedPassword,
                user_id: 'user123'
            };
            const mockToken = 'mock.jwt.token';

            const mockUser = createMockModel(mockUserData);
            const mockAuth = createMockModel(mockAuthData);

            mockUserModel.findOne.mockResolvedValue(mockUser);
            mockAuthModel.findOne.mockResolvedValue(mockAuth);
            mockComparePassword.mockResolvedValue(true);
            mockGenerateToken.mockReturnValue(mockToken);

            // Act
            const result = await repository.login(email, password);

            // Assert
            expect(result.status).toBe(201);
            expect(result.token).toBe(mockToken);
            expect(result.user).toEqual({
                id: mockUserData.id,
                name: mockUserData.name,
                email: mockUserData.email,
                role: mockUserData.user_type
            });
            expect(mockUserModel.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(mockAuthModel.findOne).toHaveBeenCalledWith({ where: { user_id: mockUserData.id } });
            expect(mockComparePassword).toHaveBeenCalledWith(password, hashedPassword);
        });

        it('debería fallar con credenciales inválidas', async () => {
            // Arrange
            const email = 'test@example.com';
            const password = 'wrongpassword';
            mockUserModel.findOne.mockResolvedValue(null);

            // Act
            const result = await repository.login(email, password);

            // Assert
            expect(result.status).toBe(401);
            expect(result.message).toBe('Credenciales inválidas');
            expect(result.token).toBe('');
            expect(result.user).toEqual({
                id: '',
                email: '',
                name: '',
                role: ''
            });
        });

        it('debería fallar con contraseña incorrecta', async () => {
            // Arrange
            const email = 'test@example.com';
            const password = 'wrongpassword';
            const mockUserData: Partial<UserAttributes> = {
                id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                user_type: 'user'
            };
            const mockAuthData: Partial<AuthAttributes> = {
                password: 'hashedPassword123',
                user_id: 'user123'
            };

            const mockUser = createMockModel(mockUserData);
            const mockAuth = createMockModel(mockAuthData);

            mockUserModel.findOne.mockResolvedValue(mockUser);
            mockAuthModel.findOne.mockResolvedValue(mockAuth);
            mockComparePassword.mockResolvedValue(false);

            // Act
            const result = await repository.login(email, password);

            // Assert
            expect(result.status).toBe(401);
            expect(result.message).toBe('Credenciales inválidas');
            expect(result.token).toBe('');
        });
    });

    describe('register', () => {
        it('debería registrar un nuevo usuario exitosamente', async () => {
            // Arrange
            const newUser: RegisterUserRequest = {
                id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                phone: '573016197438',
                role: 'user'
            };
            const hashedPassword = 'hashedPassword123';
            const mockUserData: Partial<UserAttributes> = {
                id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                user_type: 'user'
            };

            const mockCreatedUser = createMockModel(mockUserData);
            const mockCreatedAuth = createMockModel({ password: hashedPassword, user_id: mockUserData.id });

            mockUserModel.findOne.mockResolvedValue(null);
            mockUserModel.create.mockResolvedValue(mockCreatedUser);
            mockHashPassword.mockResolvedValue(hashedPassword);
            mockAuthModel.create.mockResolvedValue(mockCreatedAuth);

            // Act
            const result = await repository.register(newUser);

            // Assert
            expect(result.status).toBe(201);
            expect(result.message).toBe('Usuario registrado exitosamente');
            expect(result.user).toEqual({
                id: mockUserData.id,
                name: mockUserData.name,
                email: mockUserData.email,
                role: mockUserData.user_type
            });
            expect(mockUserModel.findOne).toHaveBeenCalledWith({ where: { email: newUser.email } });
            expect(mockUserModel.create).toHaveBeenCalled();
            expect(mockHashPassword).toHaveBeenCalledWith(newUser.password);
            expect(mockAuthModel.create).toHaveBeenCalledWith({
                password: hashedPassword,
                user_id: mockUserData.id
            });
        });

        it('debería fallar al registrar usuario con email existente', async () => {
            // Arrange
            const newUser: RegisterUserRequest = {
                id: 'user123',
                name: 'Test User',
                email: 'existing@example.com',
                password: 'password123',
                phone: '573016197438',
                role: 'user'
            };
            const existingUserData: Partial<UserAttributes> = {
                id: 'existing123',
                email: 'existing@example.com'
            };

            const mockExistingUser = createMockModel(existingUserData);
            mockUserModel.findOne.mockResolvedValue(mockExistingUser);

            // Act
            const result = await repository.register(newUser);

            // Assert
            expect(result.status).toBe(401);
            expect(result.message).toBe('El email ya está registrado');
            expect(result.user).toEqual({
                id: '',
                email: '',
                name: '',
                role: ''
            });
            expect(mockUserModel.create).not.toHaveBeenCalled();
            expect(mockAuthModel.create).not.toHaveBeenCalled();
        });
    });
}); 