# Quetzalzin — Instrucciones para Claude Code

## ¿Qué es este proyecto?

Sitio web completo para **Quetzalzin Productos Artesanales**, un negocio mexicano de cosméticos naturales, velas de soya artesanales y servicios de bienestar (masajes, depilación IPL, reflexología). El sitio permite a los clientes explorar el catálogo, agregar productos al carrito, completar pedidos y agendar citas — todo sincronizado con WhatsApp y una base de datos MySQL.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Node.js 18+ + Express 4 |
| Base de datos | **MySQL** (vía `mysql2` con pool de conexiones) |
| Autenticación admin | JWT (`jsonwebtoken`) + bcrypt |
| Frontend | HTML5 + CSS3 + JavaScript vanilla (sin frameworks) |
| Seguridad | `helmet`, `cors`, `express-rate-limit` |

## Cómo correr el proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de MySQL

# 3. Asegurarse de que MySQL esté corriendo y la base de datos exista:
#    CREATE DATABASE quetzalzin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 4. Arrancar el servidor
npm start        # producción
npm run dev      # desarrollo (auto-reload con node --watch)
```

Sitio principal: `http://localhost:3000`  
Panel de admin: `http://localhost:3000/admin`

## Primer uso — crear admin

Después de arrancar, hacer una sola vez:

```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"TuPasswordSeguro"}'
```

O desde el panel admin: hacer clic en "Crear cuenta de admin".

## Estructura de archivos

```
quetzalzin/
├── server.js              # Servidor Express principal
├── package.json
├── .env.example           # Plantilla de variables de entorno
├── CLAUDE.md              # Este archivo
├── PROJECT.md             # Documentación técnica del proyecto
│
├── db/
│   └── database.js        # Pool MySQL + initDB() async
│
├── routes/
│   ├── orders.js          # POST /api/orders
│   ├── appointments.js    # POST /api/appointments
│   └── admin.js           # Login, setup, CRUD pedidos/citas
│
├── middleware/
│   └── auth.js            # requireAuth (JWT Bearer)
│
└── public/
    ├── index.html         # Sitio principal (HTML/CSS/JS inline)
    └── admin/
        └── index.html     # Panel de administración SPA
```

## API Routes

### Públicas (sin autenticación)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/orders` | Crear nuevo pedido |
| `POST` | `/api/appointments` | Crear nueva cita |
| `POST` | `/api/admin/setup` | Crear primer admin (solo una vez) |
| `POST` | `/api/admin/login` | Login del admin |

**Body POST /api/orders:**
```json
{
  "customer_name": "string (required)",
  "customer_phone": "string (required)",
  "customer_email": "string (optional)",
  "delivery_point": "string (required)",
  "address": "string (optional)",
  "items": "[{id, name, emoji, price, variant, qty}] (required)",
  "total": "number (required)",
  "notes": "string (optional)"
}
```

**Body POST /api/appointments:**
```json
{
  "customer_name": "string (required)",
  "customer_phone": "string (required)",
  "customer_email": "string (optional)",
  "service": "string (required)",
  "date": "YYYY-MM-DD (required)",
  "time_slot": "string (required)",
  "comments": "string (optional)"
}
```

### Protegidas (requieren `Authorization: Bearer <token>`)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/admin/stats` | Dashboard stats + gráfica |
| `GET` | `/api/admin/orders` | Lista pedidos (filtros: status, search, limit, offset) |
| `PATCH` | `/api/admin/orders/:id` | Actualizar estado pedido |
| `GET` | `/api/admin/appointments` | Lista citas (filtros: status, date, search, limit, offset) |
| `PATCH` | `/api/admin/appointments/:id` | Actualizar estado cita |

## Base de datos MySQL

### Tablas

**`orders`** — Pedidos de productos
- `status`: `pending | confirmed | preparing | shipped | delivered | cancelled`
- `items`: columna JSON con el array de productos del carrito
- Numeración: `QZ-YYYYMMDD-XXXX`

**`appointments`** — Citas de servicios
- `status`: `pending | confirmed | completed | cancelled`
- Numeración: `CIT-YYYYMMDD-XXXX`

**`admin_users`** — Usuarios del panel de admin
- Contraseñas hasheadas con bcrypt (10 rondas)

### Crear la base de datos en MySQL

```sql
CREATE DATABASE quetzalzin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Las tablas se crean automáticamente al arrancar el servidor (initDB)
```

## Variables de entorno requeridas

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host MySQL | `localhost` |
| `DB_PORT` | Puerto MySQL | `3306` |
| `DB_USER` | Usuario MySQL | `root` |
| `DB_PASS` | Contraseña MySQL | `mi_password` |
| `DB_NAME` | Nombre de la base de datos | `quetzalzin` |
| `JWT_SECRET` | Secreto para JWT | cadena larga aleatoria |

## Patrones de código importantes

- **Pool de conexiones MySQL**: usar siempre `pool.execute()` (prepared statements) para queries con parámetros de usuario, y `pool.query()` solo cuando LIMIT/OFFSET son enteros validados.
- **Async/await**: todos los handlers de rutas son `async`. Los errores se capturan con `try/catch`.
- **JSON en MySQL**: la columna `items` en `orders` es tipo JSON nativo de MySQL. Al leer, `mysql2` lo devuelve ya parseado como objeto; al escribir, usar `JSON.stringify()`.
- **Sin ORM**: queries SQL directas para mayor control y rendimiento.

## Notas de deployment

### Railway / Render / Fly.io
1. Configurar las variables de entorno desde el dashboard del hosting
2. Comando de inicio: `npm start`
3. Para Railway con MySQL: agregar el plugin MySQL y usar `${{MySQL.MYSQL_URL}}` como `DATABASE_URL` o configurar las variables individuales

### Cyclic / Heroku
- Misma configuración, agregar add-on de MySQL (JawsDB o ClearDB en Heroku)

### VPS propio
- Instalar Node.js 18+ y MySQL 8.0+
- Crear la base de datos manualmente antes de arrancar
- Usar PM2: `pm2 start server.js --name quetzalzin`
