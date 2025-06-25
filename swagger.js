const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de E-commerce',
      version: '1.0.0',
      description: 'API para gerenciamento de produtos e carrinhos de compras de uma loja virtual. Não documenta sessões.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    // components: {
    //   securitySchemes: {
    //     bearerAuth: {
    //       type: 'http',
    //       scheme: 'bearer',
    //       bearerFormat: 'JWT',
    //     }
    //   }
    // },
    // security: [
    //   {
    //     bearerAuth: []
    //   }
    // ]
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;