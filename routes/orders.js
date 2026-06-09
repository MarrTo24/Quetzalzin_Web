const express = require('express');
const router = express.Router();
const { pool } = require('../db/database');

function generateOrderNumber() {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `QZ-${date}-${rand}`;
}

router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_phone, customer_email, delivery_point, address, items, total, notes } = req.body;

    if (!customer_name || !customer_phone || !delivery_point || !items || total === undefined) {
      return res.status(400).json({ error: 'Faltan campos requeridos: nombre, teléfono, punto de entrega, artículos y total.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío.' });
    }

    const order_number = generateOrderNumber();

    await pool.execute(
      `INSERT INTO orders (order_number, customer_name, customer_phone, customer_email, delivery_point, address, items, total, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_number,
        customer_name.trim(),
        customer_phone.trim(),
        customer_email ? customer_email.trim() : null,
        delivery_point,
        address ? address.trim() : null,
        JSON.stringify(items),
        parseFloat(total),
        notes ? notes.trim() : null,
      ]
    );

    res.status(201).json({ success: true, order_number });
  } catch (err) {
    console.error('Error al crear pedido:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
