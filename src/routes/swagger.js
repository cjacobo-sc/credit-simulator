const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../utils/swagger/swagger.config');

const router = express.Router();

/**
 * Ruta para la documentación Swagger en formato JSON
 */
router.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * Ruta para la interfaz de Swagger UI
 */
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Credit Simulator API Docs'
}));

module.exports = router;
