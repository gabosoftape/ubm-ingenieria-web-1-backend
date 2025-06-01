# Backend  Actividad Ingenieria WEB 1 - Ingenieria de Software. Universidad Manuela Beltran.

Backend para Actividad Ingenieria WEB - Ingenieria de Software. Universidad Manuela Beltran con Node.js, TypeScript, Express y PostgreSQL.

## Requisitos previos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## Instalaciu00f3n

1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd triviabot_backend
```

2. Instalar dependencias

```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno

```bash
cp .env.example .env
# Editar el archivo .env con los valores correctos
```

4. Crear la base de datos en PostgreSQL

```bash
psql -U postgres
CREATE DATABASE triviabot_db;
```

## Ejecuciu00f3n

### Modo desarrollo

```bash
npm run dev
# o
yarn dev
```

### Compilar para producciu00f3n

```bash
npm run build
# o
yarn build
```

### Ejecutar en producciu00f3n

```bash
npm start
# o
yarn start
```

## Estructura del proyecto

```
triviabot_backend
  /dist                # Cu00f3digo compilado (generado)
  /src                 # Cu00f3digo fuente
    /config            # Configuraciu00f3n de la aplicaciu00f3n
    /controllers       # Controladores
    /entities          # Entidades de TypeORM
    /middlewares       # Middlewares de Express
    /migrations        # Migraciones de base de datos
    /models            # Modelos y DTOs
    /routes            # Rutas de la API
    /services          # Servicios de negocio
    /utils             # Utilidades
    index.ts           # Punto de entrada
  .env.example         # Ejemplo de variables de entorno
  package.json         # Dependencias y scripts
  tsconfig.json        # Configuraciu00f3n de TypeScript
```

## API Endpoints

- `GET /api/status` - Verificar estado de la API
- `GET /` - Mensaje de bienvenida

## Licencia

ISC
