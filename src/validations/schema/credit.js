const yup = require('yup');

/**
 * Esquema de validación para simular crédito
 */
const simularSchema = yup.object({
  monto: yup
    .number()
    .positive('El monto debe ser un número mayor a 0')
    .required('El monto es requerido'),
  plazo: yup
    .number()
    .integer('El plazo debe ser un número entero')
    .min(1, 'El plazo debe ser al menos 1 mes')
    .max(120, 'El plazo no puede ser mayor a 120 meses')
    .required('El plazo es requerido'),
  tasa: yup
    .number()
    .min(0, 'La tasa debe ser al menos 0')
    .max(100, 'La tasa no puede ser mayor a 100')
    .required('La tasa es requerida'),
  clienteId: yup
    .string()
    .trim()
    .optional()
});

/**
 * Esquema de validación para comparar escenarios
 */
const compararSchema = yup.object({
  monto: yup
    .number()
    .positive('El monto debe ser un número mayor a 0')
    .required('El monto es requerido'),
  escenarios: yup
    .array()
    .of(
      yup.object({
        plazo: yup
          .number()
          .integer('El plazo debe ser un número entero')
          .min(1, 'El plazo debe ser al menos 1 mes')
          .max(120, 'El plazo no puede ser mayor a 120 meses')
          .required('El plazo es requerido'),
        tasa: yup
          .number()
          .min(0, 'La tasa debe ser al menos 0')
          .max(100, 'La tasa no puede ser mayor a 100')
          .required('La tasa es requerida')
      })
    )
    .min(1, 'Debe proporcionar al menos 1 escenario')
    .max(3, 'No puede proporcionar más de 3 escenarios')
    .required('Los escenarios son requeridos'),
  clienteId: yup
    .string()
    .trim()
    .optional()
});

/**
 * Esquema de validación para obtener historial
 */
const historialSchema = yup.object({
  clienteId: yup
    .string()
    .trim()
    .required('El clienteId es requerido')
});

module.exports = {
  simularSchema,
  compararSchema,
  historialSchema
};
