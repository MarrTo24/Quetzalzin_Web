const express = require('express');
const router = express.Router();
const { pool } = require('../db/database');

function generateAppointmentNumber() {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CIT-${date}-${rand}`;
}

router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_phone, customer_email, service, date, time_slot, comments } = req.body;

    if (!customer_name || !customer_phone || !service || !date || !time_slot) {
      return res.status(400).json({ error: 'Faltan campos requeridos: nombre, teléfono, servicio, fecha y horario.' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return res.status(400).json({ error: 'La fecha de la cita no puede ser en el pasado.' });
    }

    const appointment_number = generateAppointmentNumber();

    await pool.execute(
      `INSERT INTO appointments (appointment_number, customer_name, customer_phone, customer_email, service, date, time_slot, comments)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appointment_number,
        customer_name.trim(),
        customer_phone.trim(),
        customer_email ? customer_email.trim() : null,
        service,
        date,
        time_slot,
        comments ? comments.trim() : null,
      ]
    );

    res.status(201).json({ success: true, appointment_number });
  } catch (err) {
    console.error('Error al crear cita:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
