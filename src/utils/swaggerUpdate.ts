import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

interface SwaggerSpecs {
    paths: {
        [path: string]: {
            [method: string]: any;
        };
    };
}

export function updateSwaggerDocs(app: Express, swaggerOptions: swaggerJsdoc.Options) {
    const definedRoutes = new Set<string>();
    const documentedRoutes = new Set<string>();

    // Recopilar rutas definidas en la aplicación
    app._router.stack.forEach((middleware: any) => {
        if (middleware.route) {
            const path = middleware.route.path;
            const method = Object.keys(middleware.route.methods)[0].toUpperCase();
            definedRoutes.add(`${method} ${path}`);
        }
    });

    // Generar especificaciones de Swagger
    const specs = swaggerJsdoc(swaggerOptions) as SwaggerSpecs;

    // Recopilar rutas documentadas en Swagger
    Object.keys(specs.paths).forEach(path => {
        Object.keys(specs.paths[path]).forEach(method => {
            documentedRoutes.add(`${method.toUpperCase()} ${path}`);
        });
    });

    // Encontrar rutas no documentadas
    const undocumentedRoutes = new Set(
        [...definedRoutes].filter(x => !documentedRoutes.has(x))
    );

    // Agregar rutas no documentadas al objeto specs
    undocumentedRoutes.forEach(route => {
        const [method, path] = route.split(' ');
        if (!specs.paths[path]) {
            specs.paths[path] = {};
        }
        if (!specs.paths[path][method.toLowerCase()]) {
            specs.paths[path][method.toLowerCase()] = {
                summary: 'Ruta no documentada',
                responses: {
                    '200': {
                        description: 'Respuesta exitosa'
                    }
                }
            };
        }
    });

    // Guardar las especificaciones actualizadas
    const outputPath = path.resolve(__dirname, '../swagger.json');
    fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));

    console.log(`Especificaciones de Swagger actualizadas y guardadas en ${outputPath}`);
    console.log('Rutas totales:', definedRoutes.size);
    console.log('Rutas documentadas:', documentedRoutes.size);
    console.log('Rutas no documentadas:', undocumentedRoutes.size);

    return specs;
}