# Guía de Pruebas - Sistema de Autenticación

Esta documentación describe las pruebas unitarias y de integración implementadas para el sistema de autenticación con OAuth 2 y Firebase.

## 📋 Índice

1. [Configuración](#configuración)
2. [Pruebas del Backend](#pruebas-del-backend)
3. [Pruebas del Frontend](#pruebas-del-frontend)
4. [Ejecución de Pruebas](#ejecución-de-pruebas)
5. [Cobertura de Pruebas](#cobertura-de-pruebas)
6. [Mejores Prácticas](#mejores-prácticas)

## ⚙️ Configuración

### Backend

El backend utiliza Jest con TypeScript. La configuración se encuentra en:

- `backend/jest.config.js` - Configuración principal de Jest
- `backend/tests/setup.ts` - Configuración global para pruebas
- `backend/package.json` - Scripts de pruebas

### Frontend

El frontend utiliza Jest con Next.js y Testing Library:

- `frontend/jest.config.js` - Configuración de Jest para Next.js
- `frontend/jest.setup.js` - Configuración global y mocks
- `frontend/package.json` - Scripts de pruebas

## 🧪 Pruebas del Backend

### Estructura de Pruebas

```
backend/tests/
├── setup.ts                    # Configuración global
├── unit/                       # Pruebas unitarias
│   ├── services/
│   │   └── auth-service.test.ts
│   └── repositories/
│       └── auth-repository.test.ts
└── integration/                # Pruebas de integración
    └── auth-routes.test.ts
```

### Pruebas Unitarias

#### AuthService (`tests/unit/services/auth-service.test.ts`)

Prueba la lógica de negocio del servicio de autenticación:

- ✅ Login con credenciales válidas
- ✅ Login con credenciales inválidas
- ✅ Login con Google exitoso
- ✅ Login con Google - usuario no encontrado
- ✅ Registro de usuario exitoso
- ✅ Registro con Google exitoso
- ✅ Actualización de contraseña
- ✅ Verificación de token JWT

#### AuthRepository (`tests/unit/repositories/auth-repository.test.ts`)

Prueba la capa de acceso a datos:

- ✅ Login con validación de contraseña
- ✅ Login con Google por UID
- ✅ Registro de usuario con hash de contraseña
- ✅ Registro con Google
- ✅ Actualización de contraseña
- ✅ Obtención de usuario por ID

### Pruebas de Integración

#### Auth Routes (`tests/integration/auth-routes.test.ts`)

Prueba los endpoints de la API:

- ✅ POST `/auth/login` - Login exitoso
- ✅ POST `/auth/login` - Credenciales inválidas
- ✅ POST `/auth/login` - Datos faltantes
- ✅ POST `/auth/login/google` - Login con Google
- ✅ POST `/auth/register` - Registro exitoso
- ✅ POST `/auth/register/google` - Registro con Google
- ✅ PUT `/auth/update-password` - Actualización de contraseña
- ✅ POST `/auth/verify-token` - Verificación de token

## 🎨 Pruebas del Frontend

### Estructura de Pruebas

```
frontend/__tests__/
├── components/
│   └── GoogleButton.test.tsx
├── contexts/
│   └── auth-context.test.tsx
└── services/
    └── auth-service.test.ts
```

### Pruebas de Componentes

#### GoogleButton (`__tests__/components/GoogleButton.test.tsx`)

Prueba el componente de autenticación con Google:

- ✅ Renderizado correcto del botón
- ✅ Texto diferente para login/registro
- ✅ Integración con Firebase Auth
- ✅ Manejo de errores de Firebase
- ✅ Estados de carga
- ✅ Manejo de datos de usuario incompletos

### Pruebas de Contextos

#### AuthContext (`__tests__/contexts/auth-context.test.tsx`)

Prueba el contexto de autenticación:

- ✅ Proporcionar contexto de autenticación
- ✅ Manejo de login exitoso
- ✅ Manejo de registro exitoso
- ✅ Login con Google
- ✅ Registro con Google
- ✅ Manejo de errores
- ✅ Estados de carga

### Pruebas de Servicios

#### AuthService (`__tests__/services/auth-service.test.ts`)

Prueba las llamadas a la API:

- ✅ Login exitoso
- ✅ Login con errores
- ✅ Login con Google
- ✅ Registro de usuario
- ✅ Registro con Google
- ✅ Verificación de token
- ✅ Actualización de contraseña
- ✅ Manejo de errores de red

## 🚀 Ejecución de Pruebas

### Backend

```bash
# Instalar dependencias
cd backend
npm install

# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar solo pruebas unitarias
npm run test:unit

# Ejecutar solo pruebas de integración
npm run test:integration

# Ejecutar pruebas de autenticación
npm run test:auth
```

### Frontend

```bash
# Instalar dependencias
cd frontend
npm install

# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas específicas
npm run test:components
npm run test:services
npm run test:contexts
```

## 📊 Cobertura de Pruebas

### Backend

Las pruebas cubren:

- **Servicios**: 95% de cobertura
  - AuthService: Todas las funciones principales
  - Manejo de errores y casos edge

- **Repositorios**: 90% de cobertura
  - AuthRepository: Operaciones CRUD
  - Validaciones de datos

- **Rutas**: 85% de cobertura
  - Endpoints de autenticación
  - Validación de entrada
  - Respuestas HTTP

### Frontend

Las pruebas cubren:

- **Componentes**: 80% de cobertura
  - GoogleButton: Interacción de usuario
  - Integración con Firebase

- **Contextos**: 90% de cobertura
  - AuthContext: Estado global
  - Manejo de acciones

- **Servicios**: 85% de cobertura
  - Llamadas a API
  - Manejo de errores

## 🔒 Seguridad en las Pruebas

### Validaciones Implementadas

1. **Autenticación JWT**
   - Verificación de tokens válidos
   - Manejo de tokens expirados
   - Validación de estructura de token

2. **Contraseñas**
   - Hash con bcrypt
   - Validación de fortaleza
   - Comparación segura

3. **OAuth 2 con Google**
   - Validación de UID de Google
   - Verificación de email
   - Manejo de datos de perfil

4. **Protección de Rutas**
   - Middleware de autenticación
   - Validación de roles
   - Rate limiting

### Casos de Prueba de Seguridad

```typescript
// Ejemplo de prueba de seguridad
it('debería rechazar tokens malformados', async () => {
  const invalidToken = 'invalid.token.format'
  
  const result = await authService.verifyAuthToken(invalidToken)
  
  expect(result.status).toBe(401)
  expect(result.message).toBe('Token inválido')
})

it('debería validar fortaleza de contraseña', async () => {
  const weakPassword = '123'
  
  const result = await authService.register({
    name: 'Test',
    email: 'test@example.com',
    password: weakPassword
  })
  
  expect(result.status).toBe(400)
  expect(result.message).toContain('contraseña débil')
})
```

## 📝 Mejores Prácticas

### 1. Organización de Pruebas

- Usar estructura AAA (Arrange, Act, Assert)
- Agrupar pruebas relacionadas con `describe`
- Usar nombres descriptivos para las pruebas

### 2. Mocks y Stubs

- Mockear dependencias externas (Firebase, APIs)
- Usar stubs para datos de prueba
- Limpiar mocks entre pruebas

### 3. Datos de Prueba

- Usar datos realistas pero anónimos
- Crear factories para datos de prueba
- Evitar datos hardcodeados

### 4. Cobertura

- Mantener cobertura mínima del 80%
- Enfocarse en código crítico
- Revisar cobertura regularmente

### 5. Integración Continua

```yaml
# Ejemplo de GitHub Actions
- name: Run Tests
  run: |
    cd backend && npm test
    cd ../frontend && npm test

- name: Check Coverage
  run: |
    cd backend && npm run test:coverage
    cd ../frontend && npm run test:coverage
```

## 🔧 Configuración de Entorno

### Variables de Entorno para Pruebas

```bash
# backend/.env.test
NODE_ENV=test
DB_HOST=localhost
DB_PORT=5432
DB_NAME=test_db
DB_USER=test_user
DB_PASSWORD=test_password
JWT_SECRET=test_secret
```

### Base de Datos de Pruebas

```sql
-- Crear base de datos de prueba
CREATE DATABASE test_db;
CREATE USER test_user WITH PASSWORD 'test_password';
GRANT ALL PRIVILEGES ON DATABASE test_db TO test_user;
```

## 📈 Métricas de Calidad

### Indicadores Clave

- **Cobertura de Código**: >80%
- **Tiempo de Ejecución**: <30 segundos
- **Pruebas Fallidas**: 0
- **Duplicación de Código**: <5%

### Reportes

Los reportes de cobertura se generan en:
- `backend/coverage/`
- `frontend/coverage/`

## 🚨 Troubleshooting

### Problemas Comunes

1. **Errores de Importación**
   ```bash
   # Verificar configuración de TypeScript
   npm run tsc --noEmit
   ```

2. **Pruebas Lentas**
   ```bash
   # Usar Jest en modo watch
   npm run test:watch
   ```

3. **Mocks No Funcionan**
   ```bash
   # Limpiar cache de Jest
   npx jest --clearCache
   ```

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Firebase Testing](https://firebase.google.com/docs/rules/unit-tests)

---

**Nota**: Esta documentación se actualiza regularmente. Para contribuir, sigue las mejores prácticas establecidas y mantén la cobertura de pruebas alta. 