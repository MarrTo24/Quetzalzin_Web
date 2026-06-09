const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/database');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

    const [rows] = await pool.execute('SELECT * FROM admin_users WHERE username = ?', [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST /api/admin/setup — crear primer admin (solo si no existe ninguno)
router.post('/setup', async (req, res) => {
  try {
    const [[{ count }]] = await pool.execute('SELECT COUNT(*) as count FROM admin_users');
    if (count > 0) return res.status(400).json({ error: 'Ya existe un administrador. Usa login.' });

    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    if (password.length < 8) return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });

    const hash = await bcrypt.hash(password, 10);
    await pool.execute('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)', [username.trim(), hash]);

    res.json({ success: true, message: 'Administrador creado correctamente. Ya puedes iniciar sesión.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /api/admin/stats
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const q = (sql, params = []) => pool.execute(sql, params).then(([rows]) => rows[0]);

    const [totalOrders, todayOrders, pendingOrders, totalRevenue, monthRevenue, pendingAppts, todayAppts, totalAppts] = await Promise.all([
      q('SELECT COUNT(*) as c FROM orders'),
      q("SELECT COUNT(*) as c FROM orders WHERE DATE(created_at) = CURDATE()"),
      q("SELECT COUNT(*) as c FROM orders WHERE status = 'pending'"),
      q("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE status != 'cancelled'"),
      q("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE DATE_FORMAT(created_at,'%Y-%m') = DATE_FORMAT(NOW(),'%Y-%m') AND status != 'cancelled'"),
      q("SELECT COUNT(*) as c FROM appointments WHERE status = 'pending'"),
      q("SELECT COUNT(*) as c FROM appointments WHERE date = CURDATE()"),
      q('SELECT COUNT(*) as c FROM appointments'),
    ]);

    const [ordersChart] = await pool.execute(`
      SELECT DATE(created_at) as day, COUNT(*) as pedidos, COALESCE(SUM(total),0) as ingresos
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND status != 'cancelled'
      GROUP BY DATE(created_at)
      ORDER BY day
    `);

    const [recentOrders] = await pool.execute(
      'SELECT id, order_number, customer_name, customer_phone, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5'
    );

    const [recentAppts] = await pool.execute(
      'SELECT id, appointment_number, customer_name, service, date, time_slot, status FROM appointments ORDER BY created_at DESC LIMIT 5'
    );

    res.json({
      totalOrders:   totalOrders.c,
      todayOrders:   todayOrders.c,
      pendingOrders: pendingOrders.c,
      totalRevenue:  parseFloat(totalRevenue.s),
      monthRevenue:  parseFloat(monthRevenue.s),
      pendingAppts:  pendingAppts.c,
      todayAppts:    todayAppts.c,
      totalAppts:    totalAppts.c,
      ordersChart,
      recentOrders,
      recentAppts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /api/admin/orders
router.get('/orders', requireAuth, async (req, res) => {
  try {
    const { status, search } = req.query;
    const lim = Math.min(parseInt(req.query.limit) || 50, 200);
    const off = parseInt(req.query.offset) || 0;

    const conditions = [];
    const params = [];

    if (status && status !== 'all') { conditions.push('status = ?'); params.push(status); }
    if (search) {
      conditions.push('(customer_name LIKE ? OR customer_phone LIKE ? OR order_number LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';

    const [orders] = await pool.query(
      `SELECT * FROM orders${where} ORDER BY created_at DESC LIMIT ${lim} OFFSET ${off}`,
      params
    );
    const [[{ c: total }]] = await pool.query(`SELECT COUNT(*) as c FROM orders${where}`, params);

    res.json({ orders: orders.map(o => ({ ...o, items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items })), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// PATCH /api/admin/orders/:id
router.patch('/orders/:id', requireAuth, async (req, res) => {
  try {
    const validStatuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
    const { status } = req.body;
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Estado inválido' });

    const [result] = await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /api/admin/appointments
router.get('/appointments', requireAuth, async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const lim = Math.min(parseInt(req.query.limit) || 50, 200);
    const off = parseInt(req.query.offset) || 0;

    const conditions = [];
    const params = [];

    if (status && status !== 'all') { conditions.push('status = ?'); params.push(status); }
    if (date) { conditions.push('date = ?'); params.push(date); }
    if (search) {
      conditions.push('(customer_name LIKE ? OR customer_phone LIKE ? OR appointment_number LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';

    const [appointments] = await pool.query(
      `SELECT * FROM appointments${where} ORDER BY date ASC, time_slot ASC LIMIT ${lim} OFFSET ${off}`,
      params
    );
    const [[{ c: total }]] = await pool.query(`SELECT COUNT(*) as c FROM appointments${where}`, params);

    res.json({ appointments, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// PATCH /api/admin/appointments/:id
router.patch('/appointments/:id', requireAuth, async (req, res) => {
  try {
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    const { status } = req.body;
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Estado inválido' });

    const [result] = await pool.execute(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
