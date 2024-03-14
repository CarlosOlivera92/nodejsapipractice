import { expect } from 'chai';
import supertest from 'supertest';


const requester = supertest('http://localhost:8080');

const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU2ZTc5YTlmNmQ0YjNiYmY4M2M2MjJkIiwibmFtZSI6InVuZGVmaW5lZCB1bmRlZmluZWQiLCJhZ2UiOjI0LCJlbWFpbCI6InRoZXN0dW50bWFuOTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkQWFsREhoZ1hjcU9MalVhVC9OMTBZT0J4U1hsay9PS0VTaGI5YU1pNC9rME14OFZSMGZGUXkiLCJyb2xlIjoiUFJFTUlVTSJ9LCJpYXQiOjE3MDg1NTkyMDcsImV4cCI6MTcwODY0NTYwN30.I-waJ8GVjj6gxBNQdvm4Me3uY9uDpI-czFhiCX-jDs4'; // Reemplaza con tu token JWT válido



describe('Pruebas de integración router de sesiones', () => {

    it('GET de api/sessions/github debe redirigir a GitHub para autenticación', async () => {
        const { statusCode } = await requester.get('/api/sessions/github');
        expect(statusCode).to.be.eql(302); // Se espera una redirección a GitHub
    });

    it('GET de api/sessions/github-callback debe redirigir después de autenticarse en GitHub', async () => {
        const { statusCode } = await requester.get('/api/sessions/github-callback');
        expect(statusCode).to.be.oneOf([200, 302]);
    });

    it('GET de api/sessions/current debe devolver la información del usuario actual', async () => {

        // Realizar la solicitud GET a /auth/current incluyendo el token JWT en el encabezado de autorización
        const { statusCode, body } = await requester.get('/api/sessions/current')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(statusCode).to.be.eql(200);
        expect(body).to.have.property('user');
        // Agregar más asertos según sea necesario
    });
});
