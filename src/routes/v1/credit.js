const express = require('express');
const router = express.Router();
const validate = require('../../validations');
const controllers = require('../../controllers/v1');
const { simularSchema, compararSchema, historialSchema } = require('../../validations/schema/credit');

/**
 * @swagger
 * tags:
 *   name: Credit
 *   description: API de créditos para motos
 */

/**
 * @swagger
 * /api/v1/credit/health:
 *   get:
 *     summary: Verificar estado del servicio
 *     description: Endpoint para verificar que el servicio está funcionando correctamente
 *     tags: [Credit]
 *     responses:
 *       200:
 *         description: Servicio funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 version:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', controllers.health);

/**
 * @swagger
 * /api/v1/credit/simulate:
 *   post:
 *     summary: Simular un crédito de moto
 *     description: Calcula la tabla de amortización para un crédito de moto
 *     tags: [Credit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - monto
 *               - plazo
 *               - tasa
 *             properties:
 *               monto:
 *                 type: number
 *                 description: Monto del crédito en pesos
 *                 example: 50000
 *               plazo:
 *                 type: integer
 *                 description: Plazo en meses (1-120)
 *                 example: 12
 *               tasa:
 *                 type: number
 *                 description: Tasa de interés anual (0-100)
 *                 example: 18.5
 *               clienteId:
 *                 type: string
 *                 description: ID opcional del cliente
 *                 example: "CLI001"
 *     responses:
 *       200:
 *         description: Simulación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Error de validación
 */
router.post('/simulate', validate(simularSchema, 'body'), controllers.simulate);

/**
 * @swagger
 * /api/v1/credit/compare:
 *   post:
 *     summary: Comparar múltiples escenarios de crédito
 *     description: Compara hasta 3 escenarios diferentes de crédito con el mismo monto
 *     tags: [Credit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - monto
 *               - escenarios
 *             properties:
 *               monto:
 *                 type: number
 *                 description: Monto del crédito en pesos
 *                 example: 50000
 *               escenarios:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 3
 *                 items:
 *                   type: object
 *                   required:
 *                     - plazo
 *                     - tasa
 *                   properties:
 *                     plazo:
 *                       type: integer
 *                       description: Plazo en meses
 *                       example: 12
 *                     tasa:
 *                       type: number
 *                       description: Tasa de interés anual
 *                       example: 18.5
 *               clienteId:
 *                 type: string
 *                 description: ID opcional del cliente
 *                 example: "CLI001"
 *     responses:
 *       200:
 *         description: Comparación exitosa
 *       400:
 *         description: Error de validación
 */
router.post('/compare', validate(compararSchema, 'body'), controllers.compare);

/**
 * @swagger
 * /api/v1/credit/history/{clienteId}:
 *   get:
 *     summary: Obtener historial de créditos
 *     description: Obtiene todos los créditos realizados por un cliente
 *     tags: [Credit]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Historial obtenido exitosamente
 *       400:
 *         description: Error de validación
 */
router.get('/history/:clienteId', validate(historialSchema, 'params'), controllers.history);

module.exports = router;
