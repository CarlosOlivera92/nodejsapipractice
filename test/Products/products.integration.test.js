import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

//!ANTES DE REALIZAR LOS TESTS DEBES TENER EN CUENTA QUE SE ESPERA RECIBIR UN TOKEN PARA AUTORIZACION

describe('Pruebas de integración módulo de productos', () => {
    it('POST de /api/products debe crear un producto correctamente', async () => {
        const productMock = {
            title: 'Producto de prueba1222', //?Para pasar la prueba se debe modificar este campo al crear un nuevo producto
            description: 'Descripción del producto de prueba12',
            price: 10.99,
            thumbnail: 'https://ejemplo.com/thumbnail.jpg',
            category: 'Prueba',
            code: 'GTASAA', //?Para pasar la prueba se debe modificar este campo al crear un nuevo producto
            stock: 10,
            status: true
        };

        const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjViOTdhMGQwZTU5MzNiNjRjOWIzMGUxIiwibmFtZSI6IkFkbWluIENvZGVyIiwiYWdlIjoxOCwiZW1haWwiOiJhZG1pbkNvZGVyQGNvZGVyLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJFBBOUZOWHB6VDc1VVRqbngzWVJxNS5uZE11cFo3dFVqR3lqODBxVUtrTFZ4N2lwL2t2dzhPIiwicm9sZSI6IkFETUlOIn0sImlhdCI6MTcwNzk1MjMwNCwiZXhwIjoxNzA4MDM4NzA0fQ.QXgc0xu4MlUBRyTHPKyjytYulLhTNKJuWfHd_CtmqSI'; // Reemplaza con tu token JWT válido

        const { statusCode, _body } = await requester.post('/api/products')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(productMock);
        expect(statusCode).to.be.eql(201);
        expect(_body).to.have.property('_id');
    });

    it('GET de /api/products debe obtener todos los productos correctamente', async () => {
        const { statusCode, body } = await requester.get('/api/products');
        expect(statusCode).to.be.eql(200);
        expect(body.payload).to.be.an('array');
    });

    it('PUT de /api/products/:pid debe actualizar un producto correctamente', async () => {
        const productMock = {
            title: 'Producto de prueba actualizado',
            description: 'Descripción actualizada del producto de prueba',
            price: 15.99,
            thumbnail: 'https://ejemplo.com/thumbnail_updated.jpg',
            category: 'Prueba',
            code: 'PR001',
            stock: 10,
            status: true,
        };
        const productId = '654961d68e303ce112c0ec15'; // Reemplaza con el ID real del producto que deseas actualizar

        const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjViOTdhMGQwZTU5MzNiNjRjOWIzMGUxIiwibmFtZSI6IkFkbWluIENvZGVyIiwiYWdlIjoxOCwiZW1haWwiOiJhZG1pbkNvZGVyQGNvZGVyLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJFBBOUZOWHB6VDc1VVRqbngzWVJxNS5uZE11cFo3dFVqR3lqODBxVUtrTFZ4N2lwL2t2dzhPIiwicm9sZSI6IkFETUlOIn0sImlhdCI6MTcwNzk1MjMwNCwiZXhwIjoxNzA4MDM4NzA0fQ.QXgc0xu4MlUBRyTHPKyjytYulLhTNKJuWfHd_CtmqSI'; // Reemplaza con tu token JWT válido

        const { statusCode, _body } = await requester.put(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(productMock);
        expect(statusCode).to.be.eql(204);
    });

    it('DELETE de /api/products/:pid debe eliminar un producto correctamente', async () => {
        
        const productId = '654961d68e303ce112c0ec15'; // Reemplaza con el ID real del producto que deseas eliminar

        // Eliminar el producto

        const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjViOTdhMGQwZTU5MzNiNjRjOWIzMGUxIiwibmFtZSI6IkFkbWluIENvZGVyIiwiYWdlIjoxOCwiZW1haWwiOiJhZG1pbkNvZGVyQGNvZGVyLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJFBBOUZOWHB6VDc1VVRqbngzWVJxNS5uZE11cFo3dFVqR3lqODBxVUtrTFZ4N2lwL2t2dzhPIiwicm9sZSI6IkFETUlOIn0sImlhdCI6MTcwNzk1MjMwNCwiZXhwIjoxNzA4MDM4NzA0fQ.QXgc0xu4MlUBRyTHPKyjytYulLhTNKJuWfHd_CtmqSI'; // Reemplaza con tu token JWT válido

        const { statusCode } = await requester.delete(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${accessToken}`)
        expect(statusCode).to.be.eql(204);
    });
});
