import { Express } from 'express';
import {updateSwaggerDocs} from "./swaggerUpdate";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'UMB Actividad 1 APP API.',
            version: '1.0.1',
            description: 'Documentación de Actividad 1 APP API',
        },
    },
    apis: [
        './src/index.ts',  // Main
        './src/presentation/routers/*.ts',  // Específicamente para archivos de routers
        './src/domain/models/*.ts',  // Para archivos de modelos
        './src/domain/interfaces/common/*.ts',  // Para archivos de modelos
    ],
};

export function setupSwagger(app: Express) {
    const swaggerUi = require('swagger-ui-express');
    // Actualiza y obtiene las especificaciones de Swagger
    const swaggerSpecs = updateSwaggerDocs(app, options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
}