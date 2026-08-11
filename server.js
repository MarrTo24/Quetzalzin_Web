const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(compression());
app.use((_req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), geolocation=(), microphone=()');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
  next();
});

// El sitio es intencionalmente estático: catálogo y carrito viven en el navegador.
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(port, () => console.log(`Eve Spa × Quetzalzin: http://localhost:${port}`));
