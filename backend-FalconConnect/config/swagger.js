const swaggerJSDoc = require('swagger-jsdoc'); //Comentarios swagger a documentación JSON
const swaggerUi = require('swagger-ui-express'); //IU Servidor de Swagegr 

const options = 
{
    definition: 
    {
        openapi: '3.0.0',
        info: 
        {
            title: 'ULACIT API',
            version: '1.0.0',
            description: 'API para gestionar contactos (Node.js, Express, MongoDB)',
        },
        servers: 
        [
            {
                url: 'http://localhost:5000/api/v1',
            },
        ],
    },
        apis: ['./routes/*.js'], // <- aquí busca los comentarios de tus rutas
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = { swaggerUi, swaggerSpec };
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

