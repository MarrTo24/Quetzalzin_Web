require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { initDB } = require('./db/database');
const ordersRouter = require('./routes/orders');
const appointmentsRouter = require('./routes/appointments');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'"],
      styleSrc:   ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:    ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'"],
      imgSrc:     ["'self'", 'data:', 'https:'],
      frameAncestors: ["'none'"],
    },
  },
}));

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limit: 100 req / 15 min por IP
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));

app.use('/api/orders', ordersRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/admin', adminRouter);

// Panel admin — sirve index.html para /admin y /admin/*
app.get(['/admin', '/admin/*'], (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// 404 para rutas de API desconocidas
app.use('/api/', (_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Inicializar base de datos y arrancar servidor
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🌿 Quetzalzin servidor corriendo en http://localhost:${PORT}`);
      console.log(`   Panel de admin: http://localhost:${PORT}/admin\n`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con MySQL:', err.message);
    console.error('   Verifica que MySQL esté corriendo y las credenciales en .env sean correctas.');
    process.exit(1);
  });
