import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

//!ANTES DE REALIZAR LOS TESTS DEBES TENER EN CUENTA QUE SE ESPERA RECIBIR UN TOKEN PARA AUTORIZACION

const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU2ZTc5YTlmNmQ0YjNiYmY4M2M2MjJkIiwibmFtZSI6InVuZGVmaW5lZCB1bmRlZmluZWQiLCJhZ2UiOjI0LCJlbWFpbCI6InRoZXN0dW50bWFuOTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkQWFsREhoZ1hjcU9MalVhVC9OMTBZT0J4U1hsay9PS0VTaGI5YU1pNC9rME14OFZSMGZGUXkiLCJyb2xlIjoiUFJFTUlVTSJ9LCJpYXQiOjE3MDg1NTkyMDcsImV4cCI6MTcwODY0NTYwN30.I-waJ8GVjj6gxBNQdvm4Me3uY9uDpI-czFhiCX-jDs4'; // Reemplaza con tu token JWT válido


describe('Pruebas de integración router de carritos', () => {

    it('GET de /api/carts debe llamar al controlador adecuado', async () => {
        const { statusCode } = await requester.get('/api/carts');
        expect(statusCode).to.be.oneOf([200, 404]); // Dependerá de la lógica de tu aplicación
    });

    it('POST de /api/carts debe llamar al controlador adecuado', async () => {
        const { statusCode } = await requester.post('/api/carts')
            .set('Authorization', `Bearer ${accessToken}`)
        expect(statusCode).to.be.oneOf([201, 403]); 
    });

    it('DELETE de /api/carts/:cid debe llamar al controlador adecuado', async () => {
        const cartId = '658f042a05c47fadb852b982'; // Reemplaza con un ID de carrito existente
        const { statusCode } = await requester.delete(`/api/carts/${cartId}`)
            .set('Authorization', `Bearer ${accessToken}`)
        expect(statusCode).to.be.oneOf([200, 404]); 
    });
});
