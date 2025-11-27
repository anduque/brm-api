const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const logger = require('./utils/logger');
const { authenticate } = require('./middlewares/auth.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Solicitud procesada', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration
    });
  });
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'API BRM lista',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', authenticate, productRoutes);
app.use('/api/purchases', authenticate, purchaseRoutes);

app.use((err, req, res, next) => {
  logger.error('Error no controlado', {
    message: err.message,
    stack: err.stack
  });
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;


