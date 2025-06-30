import { AuthRepository } from '../../../src/domain/repository/auth-repository';
import UserModel from '../../../src/db/models/UserModel';
import AuthModel from '../../../src/db/models/AuthModel';
import { LoginResponse, RegisterResponse } from '../../../src/domain/models/auth';
import { generateTokenAuth } from '../../../src/config/jsonwebtoken';
import { comparePassword, hashPassword } from '../../../src/config/BcryptPassword';

// Mock de los modelos de Sequelize
jest.mock('../../../src/db/models/UserModel');
jest.mock('../../../src/db/models/AuthModel');
jest.mock('../../../src/config/jsonwebtoken');
jest.mock('../../../src/config/BcryptPassword');

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let mockUserModel: jest.Mocked<typeof UserModel>;
  let mockAuthModel: jest.Mocked<typeof AuthModel>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
    mockAuthModel = AuthModel as jest.Mocked<typeof AuthModel>;
    authRepository = new AuthRepository();
  });

  describe('login', () => {
    it('debería retornar login exitoso con credenciales válidas', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        identification: '123456',
        phone: '1234567890',
        user_type: 'user',
        auth: {
          password: 'hashedpassword'
        }
      };

      const mockToken = 'mock-jwt-token';

      mockUserModel.findOne = jest.fn().mockResolvedValue(mockUser as any);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateTokenAuth as jest.Mock).mockReturnValue(mockToken);

      // Act
      const result = await authRepository.login(email, password);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { email },
        include: [{ model: AuthModel, as: 'auth' }]
      });
      expect(comparePassword).toHaveBeenCalledWith(password, 'hashedpassword');
      expect(generateTokenAuth).toHaveBeenCalledWith(mockUser);
      expect(result.status).toBe(201);
      expect(result.token).toBe(mockToken);
      expect(result.user.email).toBe(email);
    });

    it('debería retornar error cuando el usuario no existe', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'password123';

      mockUserModel.findOne = jest.fn().mockResolvedValue(null);

      // Act
      const result = await authRepository.login(email, password);

      // Assert
      expect(result.status).toBe(401);
      expect(result.message).toBe('Credenciales inválidas');
    });

    it('debería retornar error cuando la contraseña es incorrecta', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongpassword';
      
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        auth: {
          password: 'hashedpassword'
        }
      };

      mockUserModel.findOne = jest.fn().mockResolvedValue(mockUser as any);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await authRepository.login(email, password);

      // Assert
      expect(result.status).toBe(401);
      expect(result.message).toBe('Credenciales inválidas');
    });
  });

  describe('loginWithGoogle', () => {
    it('debería retornar login exitoso con Google UID válido', async () => {
      // Arrange
      const googleData = {
        email: 'test@gmail.com',
        google_uid: 'google123',
        name: 'Test User',
        photo_url: 'https://example.com/photo.jpg'
      };

      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@gmail.com',
        google_uid: 'google123',
        photo_url: 'https://example.com/photo.jpg',
        user_type: 'user'
      };

      const mockToken = 'mock-jwt-token';

      mockUserModel.findOne = jest.fn().mockResolvedValue(mockUser as any);
      (generateTokenAuth as jest.Mock).mockReturnValue(mockToken);

      // Act
      const result = await authRepository.loginWithGoogle(googleData);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { google_uid: googleData.google_uid }
      });
      expect(generateTokenAuth).toHaveBeenCalledWith(mockUser);
      expect(result.status).toBe(201);
      expect(result.token).toBe(mockToken);
    });

    it('debería retornar error cuando el usuario de Google no existe', async () => {
      // Arrange
      const googleData = {
        email: 'nonexistent@gmail.com',
        google_uid: 'nonexistent123',
        name: 'Test User',
        photo_url: 'https://example.com/photo.jpg'
      };

      mockUserModel.findOne = jest.fn().mockResolvedValue(null);

      // Act
      const result = await authRepository.loginWithGoogle(googleData);

      // Assert
      expect(result.status).toBe(404);
      expect(result.message).toBe('Usuario no encontrado. Por favor regístrate primero.');
    });
  });

  describe('register', () => {
    it('debería registrar usuario exitosamente', async () => {
      // Arrange
      const registerData = {
        id: '1',
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user',
        phone: '1234567890'
      };

      const hashedPassword = 'hashedpassword';
      const mockUser = {
        id: '1',
        name: 'New User',
        email: 'newuser@example.com',
        user_type: 'user'
      };

      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserModel.create = jest.fn().mockResolvedValue(mockUser as any);
      mockAuthModel.create = jest.fn().mockResolvedValue({} as any);

      // Act
      const result = await authRepository.register(registerData);

      // Assert
      expect(hashPassword).toHaveBeenCalledWith(registerData.password);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        id: registerData.id,
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        user_type: registerData.role
      });
      expect(mockAuthModel.create).toHaveBeenCalledWith({
        user_id: registerData.id,
        password: hashedPassword
      });
      expect(result.status).toBe(201);
      expect(result.message).toBe('Usuario registrado exitosamente');
    });

    it('debería retornar error cuando el email ya existe', async () => {
      // Arrange
      const registerData = {
        id: '1',
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123',
        role: 'user',
        phone: '1234567890'
      };

      mockUserModel.findOne = jest.fn().mockResolvedValue({ id: '2' } as any);

      // Act
      const result = await authRepository.register(registerData);

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('El email ya está registrado');
    });
  });

  describe('registerWithGoogle', () => {
    it('debería registrar usuario con Google exitosamente', async () => {
      // Arrange
      const googleData = {
        name: 'Google User',
        email: 'googleuser@gmail.com',
        phone: '1234567890',
        role: 'user',
        google_uid: 'google123',
        photo_url: 'https://example.com/photo.jpg'
      };

      const mockUser = {
        id: '1',
        name: 'Google User',
        email: 'googleuser@gmail.com',
        user_type: 'user'
      };

      mockUserModel.create = jest.fn().mockResolvedValue(mockUser as any);

      // Act
      const result = await authRepository.registerWithGoogle(googleData);

      // Assert
      expect(mockUserModel.create).toHaveBeenCalledWith({
        name: googleData.name,
        email: googleData.email,
        phone: googleData.phone,
        user_type: googleData.role,
        google_uid: googleData.google_uid,
        photo_url: googleData.photo_url,
        auth_provider: 'google'
      });
      expect(result.status).toBe(201);
      expect(result.message).toBe('Usuario registrado exitosamente con Google');
    });

    it('debería retornar error cuando el email ya existe', async () => {
      // Arrange
      const googleData = {
        name: 'Google User',
        email: 'existing@gmail.com',
        phone: '1234567890',
        role: 'user',
        google_uid: 'google123',
        photo_url: 'https://example.com/photo.jpg'
      };

      mockUserModel.findOne = jest.fn().mockResolvedValue({ id: '2' } as any);

      // Act
      const result = await authRepository.registerWithGoogle(googleData);

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('El email ya está registrado');
    });
  });

  describe('updatePassword', () => {
    it('debería actualizar contraseña exitosamente', async () => {
      // Arrange
      const userId = '1';
      const hashedPassword = 'newhashedpassword';

      mockAuthModel.update = jest.fn().mockResolvedValue([1]);

      // Act
      const result = await authRepository.updatePassword(userId, hashedPassword);

      // Assert
      expect(mockAuthModel.update).toHaveBeenCalledWith(
        { password: hashedPassword },
        { where: { user_id: userId } }
      );
      expect(result).toBe(true);
    });

    it('debería retornar false cuando el usuario no existe', async () => {
      // Arrange
      const userId = '999';
      const hashedPassword = 'newhashedpassword';

      mockAuthModel.update = jest.fn().mockResolvedValue([0]);

      // Act
      const result = await authRepository.updatePassword(userId, hashedPassword);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getUserById', () => {
    it('debería retornar usuario por ID', async () => {
      // Arrange
      const userId = 1;
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        user_type: 'user'
      };

      mockUserModel.findByPk = jest.fn().mockResolvedValue(mockUser as any);

      // Act
      const result = await authRepository.getUserById(userId);

      // Assert
      expect(mockUserModel.findByPk).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('debería retornar null cuando el usuario no existe', async () => {
      // Arrange
      const userId = 999;

      mockUserModel.findByPk = jest.fn().mockResolvedValue(null);

      // Act
      const result = await authRepository.getUserById(userId);

      // Assert
      expect(result).toBeNull();
    });
  });
}); 