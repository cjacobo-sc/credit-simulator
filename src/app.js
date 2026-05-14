const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const requestIp = require('request-ip');
const { creditRoutes } = require('./routes/v1');
const swaggerRoutes = require('./routes/swagger');
const errorHandler = require('./middlewares/errorHandler');

class App {
  constructor() {
    this.app = express();
    this.app.set('trust proxy', true);
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  configureMiddlewares() {
    this.app.use(helmet());

    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS || '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    this.app.use(requestIp.mw());

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  configureRoutes() {
    this.app.get('/', (req, res) => {
      res.json({
        service: 'Credit Microservice',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
          v1: {
            health: 'GET /api/v1/credit/health',
            simulate: 'POST /api/v1/credit/simulate',
            compare: 'POST /api/v1/credit/compare',
            history: 'GET /api/v1/credit/history/:clienteId'
          }
        }
      });
    });

    this.app.use(swaggerRoutes);
    this.app.use('/api/v1/credit', creditRoutes);

    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.originalUrl
      });
    });
  }

  configureErrorHandling() {
    this.app.use(errorHandler);
  }

  getApp() {
    return this.app;
  }
}

module.exports = new App().getApp();
