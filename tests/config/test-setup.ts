import { sequelize } from '../../src/config/sequelizeConfig';
import { beforeAll, afterAll, beforeEach } from '@jest/globals';

beforeAll(async () => {
    try {
        // Conectar a la base de datos de prueba
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        // Cerrar la conexión
        await sequelize.close();
        console.log('Conexión a la base de datos cerrada correctamente.');
    } catch (error) {
        console.error('Error al cerrar la conexión con la base de datos:', error);
        throw error;
    }
});

beforeEach(async () => {
    try {
        // Limpiar la base de datos antes de cada test
        await sequelize.truncate({ cascade: true });
        console.log('Base de datos limpiada correctamente.');
    } catch (error) {
        console.error('Error al limpiar la base de datos:', error);
        throw error;
    }
}); 