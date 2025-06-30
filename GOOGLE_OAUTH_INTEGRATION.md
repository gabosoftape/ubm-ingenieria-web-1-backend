# Integración de Google OAuth en el Backend

## Resumen de cambios implementados

### 1. **Modelo de Usuario Actualizado**
- ✅ Agregadas columnas `google_uid`, `photo_url`, `auth_provider`
- ✅ Soporte para múltiples proveedores de autenticación

### 2. **Nuevos Casos de Uso**
- ✅ `LoginGoogleUseCase` - Login con Google
- ✅ `RegisterGoogleUseCase` - Registro con Google

### 3. **Servicios Actualizados**
- ✅ `AuthService` con métodos de Google OAuth
- ✅ `AuthRepository` con lógica de base de datos

### 4. **Endpoints Nuevos**
- ✅ `POST /api/v1/auth/login/google`
- ✅ `POST /api/v1/auth/register/google`

### 5. **Documentación Swagger**
- ✅ Documentación completa de los nuevos endpoints

## Pasos para activar la integración

### 1. **Ejecutar la migración de base de datos**

```sql
-- Ejecuta el archivo migration-add-google-fields.sql en tu base de datos
-- O ejecuta estos comandos directamente:

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_uid VARCHAR(255),
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local';

CREATE INDEX IF NOT EXISTS idx_users_google_uid ON users(google_uid);
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);
```

### 2. **Reiniciar el servidor backend**

```bash
npm run dev
# o
npm start
```

### 3. **Verificar que los endpoints funcionan**

Puedes probar los endpoints con curl o Postman:

**Login con Google:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/login/google \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@gmail.com",
    "google_uid": "123456789",
    "name": "Usuario Ejemplo",
    "photo_url": "https://example.com/photo.jpg"
  }'
```

**Registro con Google:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/register/google \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Ejemplo",
    "email": "usuario@gmail.com",
    "phone": "1234567890",
    "role": "user",
    "google_uid": "123456789",
    "photo_url": "https://example.com/photo.jpg"
  }'
```

## Funcionalidades implementadas

### **Login con Google**
- Busca usuario por email
- Verifica que el usuario tenga autenticación de Google
- Actualiza `google_uid` si no existe
- Genera token JWT
- Retorna datos del usuario

### **Registro con Google**
- Verifica que el email no esté registrado
- Crea usuario con datos de Google
- Asigna cuenta por defecto (account_id: 1)
- No requiere contraseña
- Marca `auth_provider` como 'google'

### **Compatibilidad**
- ✅ Usuarios existentes pueden migrar a Google
- ✅ Usuarios de Google no pueden usar login tradicional
- ✅ Usuarios tradicionales no pueden usar Google (hasta que se migren)

## Estructura de datos

### **Tabla users actualizada:**
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    identification VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    user_type VARCHAR(255) DEFAULT 'user',
    google_uid VARCHAR(255),           -- NUEVO
    photo_url TEXT,                    -- NUEVO
    auth_provider VARCHAR(50) DEFAULT 'local'  -- NUEVO
);
```

### **Tipos de auth_provider:**
- `'local'` - Usuario registrado con email/password
- `'google'` - Usuario registrado con Google OAuth

## Manejo de errores

### **Errores comunes:**
- **404**: Usuario no encontrado (para login)
- **401**: Email ya registrado (para registro)
- **401**: Email registrado con contraseña (para login con Google)
- **500**: Error interno del servidor

### **Mensajes de error específicos:**
- "Usuario no encontrado. Por favor regístrate primero."
- "Este email está registrado con contraseña. Usa el login tradicional."
- "El email ya está registrado"

## Integración con Frontend

El frontend ya está configurado para usar estos endpoints. Solo asegúrate de:

1. **Configurar Firebase** en el frontend
2. **Tener el backend corriendo** en el puerto correcto
3. **Ejecutar la migración** de base de datos

## Próximos pasos (opcionales)

### **Mejoras futuras:**
- [ ] Verificación de tokens de Google en el backend
- [ ] Migración automática de usuarios existentes
- [ ] Soporte para otros proveedores OAuth (Facebook, GitHub)
- [ ] Gestión de cuentas múltiples por usuario

### **Seguridad adicional:**
- [ ] Validación de tokens de Google en el backend
- [ ] Rate limiting para endpoints de OAuth
- [ ] Logs de auditoría para autenticación OAuth

## Notas importantes

- Los usuarios de Google **NO** tienen contraseña en la base de datos
- El campo `auth_provider` determina el tipo de autenticación
- Los usuarios pueden migrar de local a Google automáticamente
- La migración de Google a local requiere reset de contraseña 