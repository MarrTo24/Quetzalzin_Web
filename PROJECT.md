# Quetzalzin — Documentación del Proyecto

**Versión:** 1.0.0  
**Última actualización:** Junio 2026  
**Negocio:** Quetzalzin Productos Artesanales — cosméticos naturales y velas artesanales, Ciudad de México  
**Contacto:** mnavarro@seguridata.com

---

## Descripción del negocio

Quetzalzin es una marca artesanal mexicana que ofrece:

- **Productos cosméticos naturales**: bálsamos, geles, sérum, cremas, jabones artesanales
- **Velas de soya artesanales**: rectangulares, burbuja, arcoíris, navideñas, en diversas fragancias
- **Accesorios de cemento**: platos y portavelas personalizables
- **Servicios de bienestar**: depilación IPL, masajes terapéutico/relajante/descontracturante, reflexología, tratamiento facial

Todos los productos se elaboran a mano con ingredientes naturales 100% mexicanos.

---

## Funcionalidades del sitio web

### Para clientes

| Función | Cómo funciona |
|---|---|
| **Catálogo de productos** | 25 productos en 6 categorías con filtros por tabs |
| **Carrito de compras** | Drawer lateral, persiste en localStorage, cantidad ajustable |
| **Checkout modal** | Formulario captura datos del cliente, guarda en MySQL, abre WhatsApp con resumen |
| **Número de pedido** | Formato `QZ-YYYYMMDD-XXXX`, generado automáticamente |
| **Agenda de cita** | Formulario completo, guarda en MySQL, abre WhatsApp, genera `CIT-YYYYMMDD-XXXX` |
| **Promociones** | 6 combos con precios especiales, agregables al carrito |
| **Diseño responsive** | Funciona en móvil y desktop, hamburger menu en móvil |

### Para la administradora

**URL del panel:** `tudominio.com/admin`

| Sección | Funciones |
|---|---|
| **Dashboard** | Stats en tiempo real: pedidos hoy, ingresos del mes, citas pendientes, gráfica de 7 días |
| **Pedidos** | Lista completa, búsqueda por nombre/teléfono/N°, filtro por estado, actualizar estado |
| **Citas** | Lista completa, búsqueda, filtro por fecha y estado, actualizar estado |

**Estados de pedidos:** Pendiente → Confirmado → Preparando → Enviado → Entregado (o Cancelado)  
**Estados de citas:** Pendiente → Confirmada → Completada (o Cancelada)

---

## Catálogo de productos

### Cosmética
| Producto | Precio | Presentación |
|---|---|---|
| Bálsamo Mágico | $215 | 120 ml |
| Gel Mágico | $120 | 130 ml |
| Sérum Facial | $150 | 50 ml |
| Lashes Tratamiento | $80 | 6 ml |

### Cabello
| Producto | Precio | Presentación |
|---|---|---|
| Shampoo Hidratante | $120 / $150 | 250 ml / 490 ml |

### Corporal
| Producto | Precio | Presentación |
|---|---|---|
| Jabón Artesanal Natural | $30 | barra |
| Jabón Artesanal Planta | $40 | barra |
| Sal Exfoliante | $60 | 90 gr |
| Crema Corporal | $140 / $170 | 250 ml / 490 ml |
| Crema Varices | $180 | 250 ml |
| Gel Reductivo | $140 | 250 ml |

### Velas
| Producto | Precio |
|---|---|
| Vela Rectangular | $110 |
| Vela Bola de Estambre | $80 |
| Vela Arcoíris | $150 |
| Vela Burbuja | $100 |
| Velas Hermanas (set) | $210 |
| Vela Pino Chico | $130 |
| Vela Pino Grande | $160 |

### Accesorios
| Producto | Precio |
|---|---|
| Plato Chico (cemento) | $100 |
| Plato Grande (cemento) | $130 |
| Set Plato Chico + Vela | $180 |
| Set Plato Grande + 1 Vela | $200 |
| Set Plato Grande + 2 Velas | $230 |
| Set Plato + Portavelas Difusor | $260 |
| Set Plato + Portavelas Cilindro | $300 |

### Servicios
- Depilación con Luz Pulsada (IPL) — paquete de 6 sesiones
- Masaje Terapéutico
- Masaje Relajante
- Masaje Descontracturante
- Reflexología
- Tratamiento Facial Natural

*Todos los servicios: "Consultar precio"*

---

## Puntos de entrega

- Metro CU
- Metrobús Universidad
- Perisur
- Estadio Azteca
- Correos de México
- DHL
- Entrega a domicilio (pedir dirección)

---

## Redes sociales

| Red | URL |
|---|---|
| WhatsApp | +52 15626277691 |
| Instagram | @quetzalzin.prod_artesanal |
| Facebook | QuetzalzinArtesanalProd |
| TikTok | @quetzalzinprodartesanal |

---

## Configuración del servidor de producción

### Requisitos mínimos
- Node.js 18 o superior
- MySQL 8.0 o superior (o MariaDB 10.6+)
- 512 MB RAM mínimo
- Dominio con SSL/HTTPS (recomendado Cloudflare)

### Pasos para deploy en VPS

```bash
# 1. Clonar/subir el proyecto
git clone <repo> /var/www/quetzalzin
cd /var/www/quetzalzin

# 2. Instalar dependencias
npm install --production

# 3. Crear base de datos
mysql -u root -p -e "CREATE DATABASE quetzalzin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. Configurar variables de entorno
cp .env.example .env
nano .env  # rellenar credenciales reales

# 5. Arrancar con PM2
npm install -g pm2
pm2 start server.js --name quetzalzin
pm2 save
pm2 startup
```

### Nginx (proxy inverso)
```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Servicios cloud recomendados (hosting)
| Servicio | Plan gratuito | MySQL incluido | Notas |
|---|---|---|---|
| **Railway** | Sí (500h/mes) | Sí (plugin) | El más fácil para deploy |
| **Render** | Sí (spin-down) | Sí (addon) | Buena opción |
| **Fly.io** | Sí (limitado) | No (externo) | Más técnico |
| **DigitalOcean** | No ($6/mes) | Sí (Managed DB) | Más profesional |

---

## Seguridad implementada

- **Helmet.js**: cabeceras de seguridad HTTP (CSP, HSTS, X-Frame-Options, etc.)
- **Rate limiting**: máximo 100 requests por IP cada 15 minutos en la API
- **JWT**: tokens con expiración de 24h para el panel admin
- **bcrypt**: contraseñas hasheadas con 10 rondas
- **Prepared statements**: mysql2 con `execute()` para prevenir SQL injection
- **CORS**: configurado para el dominio de producción

---

## Historial de cambios

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0.0 | Jun 2026 | Versión inicial — sitio completo con backend Node.js + MySQL, panel admin, checkout modal, agenda de citas |
