# Eve Spa × Quetzalzin

Sitio estático para reservar/cotizar servicios de Eve Spa y productos de Quetzalzin. No usa base de datos, usuarios ni pagos. El carrito se guarda en `localStorage` bajo la clave `eve-quetzalzin-quote`.

## Ejecución

1. Instala dependencias si el proyecto aún no las tiene: `npm install`.
2. Inicia el sitio: `npm start`.
3. Abre `http://localhost:3000`.

También puede abrirse `public/index.html` directamente para revisar la interfaz, aunque el servidor local es la forma recomendada.

## Configuración de WhatsApp

En `public/index.html`, al inicio del bloque `CONFIG`, está la variable:

- `WHATSAPP='525523278809'`: corresponde al número publicado de forma consistente en los anuncios de Eve Spa: `55 2327 8809`.

El carrito genera automáticamente un mensaje a ese WhatsApp con artículos, variantes, cantidades, precios y total estimado.

## Datos pendientes de confirmar

- Redes sociales y dirección de Quetzalzin.
- Inventario, aromas, colores y personalizaciones de Quetzalzin.
- Fotografías individuales y derechos/versión web de las imágenes del catálogo PDF.
- Vigencia de precios y promociones; en especial, la publicación de IPL presenta datos que deben validarse para zonas grandes/cuerpo completo.
- Número de sesiones de la promoción de sauna y disponibilidad de paquetes de Eve Spa.
- Cualquier comunicación de resultados de salud o estética antes de publicarla como afirmación comercial.

## Recursos locales

Las piezas visuales de Eve Spa se encuentran en `public/assets/`. El diseño es propio; las imágenes se usan como material proporcionado por el cliente.
