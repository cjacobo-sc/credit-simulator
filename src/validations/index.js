/**
 * Middleware de validación usando Yup
 * @param {Object} schema - Esquema de validación de Yup
 * @param {string} source - Fuente de datos a validar ('body', 'params', 'query')
 */
const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];
      
      // Validar usando el esquema de Yup
      const validated = await schema.validate(dataToValidate, {
        abortEarly: false, // Retorna todos los errores
        stripUnknown: true // Remueve campos no definidos en el esquema
      });
      
      // Reemplazar los datos con los datos validados
      req[source] = validated;
      
      next();
    } catch (error) {
      // Formatear errores de validación
      if (error.name === 'ValidationError') {
        const errors = error.inner.map(err => ({
          field: err.path,
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          errors
        });
      }
      
      // Error inesperado
      next(error);
    }
  };
};

module.exports = validate;
