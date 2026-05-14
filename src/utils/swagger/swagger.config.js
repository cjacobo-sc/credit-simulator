const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Configuración de Swagger/OpenAPI
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Credit Simulator API',
      version: '1.0.0',
      description: 'API REST para simulación de créditos de motos con tabla de amortización',
      contact: {
        name: 'API Support',
        email: 'support@creditsimulator.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.creditsimulator.com',
        description: 'Servidor de producción'
      }
    ],
    tags: [
      {
        name: 'Simulation',
        description: 'Endpoints relacionados con la simulación de créditos'
      }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error de validación'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        SimulationResult: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                monto: {
                  type: 'number',
                  example: 50000
                },
                plazo: {
                  type: 'integer',
                  example: 12
                },
                tasa: {
                  type: 'number',
                  example: 18.5
                },
                cuotaMensual: {
                  type: 'number',
                  example: 4625.32
                },
                totalIntereses: {
                  type: 'number',
                  example: 5503.84
                },
                totalPagar: {
                  type: 'number',
                  example: 55503.84
                },
                tablaAmortizacion: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      mes: {
                        type: 'integer'
                      },
                      cuota: {
                        type: 'number'
                      },
                      capital: {
                        type: 'number'
                      },
                      interes: {
                        type: 'number'
                      },
                      saldoRestante: {
                        type: 'number'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/v1/*.js'] // Archivos que contienen anotaciones de Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
