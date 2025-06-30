import request from 'supertest';
import express from 'express';
import AuthRouter from '../../src/presentation/routers/auth-router';


// Mock de las dependencias
jest.mock('../../src/infrastructure/services/auth-service');
jest.mock('../../src/domain/repository/auth-repository');

// Crear mocks para los casos de uso
let mockVerifyUserByPhone: any;
let mockVerifyAuthTokenCaseUse: any;
let mockLoginUseCase: any;
let mockRegisterUseCase: any;
let mockLoginGoogleUseCase: any;
let mockRegisterGoogleUseCase: any;
let mockUpdateUserPasswordUseCase: any;

describe('Auth Routes Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifyUserByPhone = { execute: jest.fn() };
    mockVerifyAuthTokenCaseUse = { execute: jest.fn() };
    mockLoginUseCase = { execute: jest.fn() };
    mockRegisterUseCase = { execute: jest.fn() };
    mockLoginGoogleUseCase = { execute: jest.fn() };
    mockRegisterGoogleUseCase = { execute: jest.fn() };
    mockUpdateUserPasswordUseCase = { execute: jest.fn() };

    // middleware for auth
    const authMiddleware = AuthRouter(
      mockVerifyUserByPhone,
      mockVerifyAuthTokenCaseUse,
      mockLoginUseCase,
      mockRegisterUseCase,
      mockLoginGoogleUseCase,
      mockRegisterGoogleUseCase,
      mockUpdateUserPasswordUseCase
    );
    // Crear aplicación Express para pruebas
    app = express();
    app.use(express.json());
    
    
    // Configurar rutas con el servicio mockeado
    app.use('/auth', authMiddleware);
  });

  describe('POST /auth/login', () => {
    it('debería retornar 201 con token válido para credenciales correctas', async () => {
        const loginData = {
          email: 'test@example.com',
          password: 'password123'
        };
        const mockResponse = {
          status: 201,
          token: 'mock-jwt-token',
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user'
          }
        };
        mockLoginUseCase.execute.mockResolvedValue(mockResponse);
        const response = await request(app)
          .post('/auth/login')
          .send(loginData)
          .expect(201);
        expect(response.body).toEqual(mockResponse);
        // Cambia aquí según cómo el router llame a execute:
        expect(mockLoginUseCase.execute).toHaveBeenCalledWith(loginData.email, loginData.password);
      });

    it('debería retornar 401 para credenciales inválidas', async () => {
        const loginData = {
            email: 'test@example.com',
            password: 'wrongpassword'
        };
        const mockResponse = {
            status: 401,
            message: 'Credenciales inválidas',
            token: '',
            user: {
            id: '',
            email: '',
            name: '',
            role: ''
            }
        };
        mockLoginUseCase.execute.mockResolvedValue(mockResponse);
        const response = await request(app)
            .post('/auth/login')
            .send(loginData)
            .expect(401);
        expect(response.body).toEqual(mockResponse);
        expect(mockLoginUseCase.execute).toHaveBeenCalledWith(loginData.email, loginData.password);
    });

  });

  describe('POST /auth/login/google', () => {
    it('debería retornar 201 con token para login con Google válido', async () => {
      // Arrange
      const googleData = {
        email: 'test@gmail.com',
        google_uid: 'google123',
        name: 'Test User',
        photo_url: 'https://example.com/photo.jpg'
      };

      const mockResponse = {
        status: 201,
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@gmail.com',
          role: 'user'
        }
      };

      mockLoginGoogleUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const response = await request(app)
        .post('/auth/login/google')
        .send(googleData)
        .expect(201);

      // Assert
      expect(response.body).toEqual(mockResponse);
      expect(mockLoginGoogleUseCase.execute).toHaveBeenCalledWith(googleData);
    });

    it('debería retornar 404 para usuario de Google no registrado', async () => {
      // Arrange
      const googleData = {
        email: 'nonexistent@gmail.com',
        google_uid: 'nonexistent123',
        name: 'Test User',
        photo_url: 'https://example.com/photo.jpg'
      };

      const mockResponse = {
        status: 404,
        message: 'Usuario no encontrado. Por favor regístrate primero.',
        token: '',
        user: {
          id: '',
          email: '',
          name: '',
          role: ''
        }
      };

      mockLoginGoogleUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const response = await request(app)
        .post('/auth/login/google')
        .send(googleData)
        .expect(404);

      // Assert
      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('POST /auth/register', () => {
    it('debería retornar 201 para registro exitoso', async () => {
      // Arrange
      const registerData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'user'
      };

      const mockResponse = {
        status: 201,
        message: 'Usuario registrado exitosamente',
        user: {
          id: '1',
          name: 'New User',
          email: 'newuser@example.com',
          role: 'user'
        }
      };

      mockRegisterUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      // Assert
      expect(response.body).toEqual(mockResponse);
      expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(registerData);
    });

    it('debería retornar 400 para email duplicado', async () => {
      // Arrange
      const registerData = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'user'
      };

      const mockResponse = {
        status: 400,
        message: 'El email ya está registrado',
        user: {
          id: '',
          name: '',
          email: '',
          role: ''
        }
      };

      mockRegisterUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(registerData)
        .expect(400);

      // Assert
      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('POST /auth/register/google', () => {
    it('debería retornar 201 para registro con Google exitoso', async () => {
      // Arrange
      const googleData = {
        name: 'Google User',
        email: 'googleuser@gmail.com',
        phone: '1234567890',
        role: 'user',
        google_uid: 'google123',
        photo_url: 'https://example.com/photo.jpg'
      };

      const mockResponse = {
        status: 201,
        message: 'Usuario registrado exitosamente con Google',
        user: {
          id: '1',
          name: 'Google User',
          email: 'googleuser@gmail.com',
          role: 'user'
        }
      };

      mockRegisterGoogleUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const response = await request(app)
        .post('/auth/register/google')
        .send(googleData)
        .expect(201);

      // Assert
      expect(response.body).toEqual(mockResponse);
      expect(mockRegisterGoogleUseCase.execute).toHaveBeenCalledWith(googleData);
    });
  });

}); 