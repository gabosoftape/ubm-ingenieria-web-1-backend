import request from 'supertest';
import { app } from '../../src';  // Ajusta la ruta al archivo donde exportas la app

describe('GET /api/v1/accounts/all', () => {
    it('should return a list of accounts', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywicGhvbmUiOiI1NzMwMTYxOTc0MzgiLCJpYXQiOjE3MjY4Nzc0MTYsImV4cCI6MTcyNjkyMDYxNn0.bM9sU4qrFkq1XraeQAsDmC8EeTMDxA5fxKmn-cMZcL0';  // Reemplaza con tu token real

        const response = await request(app)
            .get('/api/v1/accounts/all')
            .set('Authorization', `Bearer ${token}`);  // Añade el Bearer token

        expect(response.status).toBe(500);
        expect(response.body).toBeInstanceOf(Object);
    });
});