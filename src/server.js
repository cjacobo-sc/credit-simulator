require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./utils/mysql/mysql.config');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    app.listen(PORT);
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await sequelize.close();
  process.exit(0);
});

startServer();
