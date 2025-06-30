import dotenv from 'dotenv';

// Cargar variables de entorno para pruebas
dotenv.config({ path: '.env.test' });

// Configuración global para pruebas
beforeAll(() => {
  // Configurar base de datos de prueba si es necesario
  console.log('Configurando entorno de pruebas...');
});

afterAll(() => {
  // Limpiar recursos después de todas las pruebas
  console.log('Limpiando entorno de pruebas...');
});

// Configurar timeouts globales
jest.setTimeout(10000);

// Mock de console.log para pruebas más limpias
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 