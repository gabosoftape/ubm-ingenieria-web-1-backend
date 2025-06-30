import { AuthService } from '../../../src/infrastructure/services/auth-service';
import { AuthRepository } from '../../../src/domain/repository/auth-repository';
import { LoginResponse, RegisterResponse, GoogleLoginRequest, GoogleRegisterRequest } from '../../../src/domain/models/auth';
import { UserAttributes } from '../../../src/db/models/UserModel';
import { generateTokenAuth } from '../../../src/config/jsonwebtoken';
import { hashPassword } from '../../../src/config/BcryptPassword';

// Mock de las dependencias
jest.mock('../../../src/domain/repository/auth-repository');
jest.mock('../../../src/config/jsonwebtoken');
jest.mock('../../../src/config/BcryptPassword');

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    
    // Crear mock del repositorio
    mockAuthRepository = new AuthRepository() as jest.Mocked<AuthRepository>;
    authService = new AuthService(mockAuthRepository);
  });

  describe('login', () => {
    it('debería retornar login exitoso con credenciales válidas', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';

      const mockLoginResponse: LoginResponse = {
        status: 201,
        token: 'mock-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        }
      };

      mockAuthRepository.login = jest.fn().mockResolvedValue(mockLoginResponse);

      // Act
      const result = await authService.login(email, password);

      // Assert
      expect(mockAuthRepository.login).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(mockLoginResponse);
      expect(result.status).toBe(201);
      expect(result.token).toBe('mock-token');
    });

    it('debería retornar error cuando el login falla', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongpassword';

      mockAuthRepository.login = jest.fn().mockResolvedValue({
        status: 401,
        message: 'Credenciales inválidas',
        token: '',
        user: {
          id: '',
          email: '',
          name: '',
          role: ''
        }
      });

      // Act
      const result = await authService.login(email, password);

      // Assert
      expect(result.status).toBe(401);
      expect(result.message).toBe('Credenciales inválidas');
    });
  });

  describe('loginWithGoogle', () => {
    it('debería retornar login exitoso con datos de Google válidos', async () => {
      // Arrange
      const googleData: GoogleLoginRequest = {
        email: 'test@gmail.com',
        google_uid: 'google123',
        name: 'Test User',
        photo_url: 'https://example.com/photo.jpg'
      };

      const mockLoginResponse: LoginResponse = {
        status: 201,
        token: 'mock-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@gmail.com',
          role: 'user'
        }
      };

      mockAuthRepository.loginWithGoogle = jest.fn().mockResolvedValue(mockLoginResponse);

      // Act
      const result = await authService.loginWithGoogle(googleData);

      // Assert
      expect(mockAuthRepository.loginWithGoogle).toHaveBeenCalledWith(googleData);
      expect(result).toEqual(mockLoginResponse);
      expect(result.status).toBe(201);
    });

    it('debería retornar error cuando el usuario no existe', async () => {
      // Arrange
      const googleData: GoogleLoginRequest = {
        email: 'nonexistent@gmail.com',
        google_uid: 'google123',
        name: 'Test User',
        photo_url: 'https://example.com/photo.jpg'
      };

      mockAuthRepository.loginWithGoogle = jest.fn().mockResolvedValue({
        status: 404,
        message: 'Usuario no encontrado. Por favor regístrate primero.',
        token: '',
        user: {
          id: '',
          email: '',
          name: '',
          role: ''
        }
      });

      // Act
      const result = await authService.loginWithGoogle(googleData);

      // Assert
      expect(result.status).toBe(404);
      expect(result.message).toContain('Usuario no encontrado');
    });
  });

  describe('register', () => {
    it('debería retornar registro exitoso con datos válidos', async () => {
      // Arrange
      const registerData = {
        id: '1',
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user',
        phone: '1234567890'
      };

      const mockRegisterResponse: RegisterResponse = {
        status: 201,
        message: 'Usuario registrado exitosamente',
        user: {
          id: '1',
          name: 'New User',
          email: 'newuser@example.com',
          role: 'user'
        }
      };

      mockAuthRepository.register = jest.fn().mockResolvedValue(mockRegisterResponse);

      // Act
      const result = await authService.register(registerData);

      // Assert
      expect(mockAuthRepository.register).toHaveBeenCalledWith(registerData);
      expect(result).toEqual(mockRegisterResponse);
      expect(result.status).toBe(201);
    });
  });

  describe('registerWithGoogle', () => {
    it('debería retornar registro exitoso con datos de Google válidos', async () => {
      // Arrange
      const googleData: GoogleRegisterRequest = {
        name: 'Google User',
        email: 'googleuser@gmail.com',
        phone: '1234567890',
        role: 'user',
        google_uid: 'google123',
        photo_url: 'https://example.com/photo.jpg'
      };

      const mockRegisterResponse: RegisterResponse = {
        status: 201,
        message: 'Usuario registrado exitosamente con Google',
        user: {
          id: '1',
          name: 'Google User',
          email: 'googleuser@gmail.com',
          role: 'user'
        }
      };

      mockAuthRepository.registerWithGoogle = jest.fn().mockResolvedValue(mockRegisterResponse);

      // Act
      const result = await authService.registerWithGoogle(googleData);

      // Assert
      expect(mockAuthRepository.registerWithGoogle).toHaveBeenCalledWith(googleData);
      expect(result).toEqual(mockRegisterResponse);
      expect(result.status).toBe(201);
    });
  });

  describe('updatePassword', () => {
    it('debería actualizar la contraseña exitosamente', async () => {
      // Arrange
      const userId = '1';
      const newPassword = 'newpassword123';
      const hashedPassword = 'hashedpassword';

      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      mockAuthRepository.updatePassword = jest.fn().mockResolvedValue(true);

      // Act
      const result = await authService.updatePassword(userId, newPassword);

      // Assert
      expect(hashPassword).toHaveBeenCalledWith(newPassword);
      expect(mockAuthRepository.updatePassword).toHaveBeenCalledWith(userId, hashedPassword);
      expect(result.status).toBe(200);
      expect(result.message).toBe('Contraseña actualizada exitosamente');
    });

    it('debería retornar error cuando el usuario no existe', async () => {
      // Arrange
      const userId = '999';
      const newPassword = 'newpassword123';
      const hashedPassword = 'hashedpassword';

      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      mockAuthRepository.updatePassword = jest.fn().mockResolvedValue(false);

      // Act
      const result = await authService.updatePassword(userId, newPassword);

      // Assert
      expect(result.status).toBe(404);
      expect(result.message).toBe('Usuario no encontrado');
    });
  });

  describe('verifyAuthToken', () => {
    it('debería verificar token válido exitosamente', async () => {
      // Arrange
      const token = 'valid-token';
      const mockUser: UserAttributes = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        identification: '123456',
        phone: '1234567890',
        user_type: 'user'
      };

      (generateTokenAuth as jest.Mock).mockReturnValue(token);
      mockAuthRepository.getUserById = jest.fn().mockResolvedValue(mockUser);

      // Act
      const result = await authService.verifyAuthToken(token);

      // Assert
      expect(result.status).toBe(200);
      expect(result.message).toBe('ok');
      expect(result.data).toEqual(mockUser);
    });

    it('debería retornar error cuando el token es inválido', async () => {
      // Arrange
      const token = 'invalid-token';

      (generateTokenAuth as jest.Mock).mockReturnValue('string');

      // Act
      const result = await authService.verifyAuthToken(token);

      // Assert
      expect(result.status).toBe(401);
      expect(result.message).toBe('El token ha expirado');
    });
  });
}); 