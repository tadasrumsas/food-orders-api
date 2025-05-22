const db = require('../models/db');
const { validationResult } = require('express-validator');

exports.getAllOrders = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT o.id, o.customerId, o.orderDate, o.status, o.dishId, d.name as dishName, d.price
      FROM orders o
      JOIN dishes d ON o.dishId = d.id
      ORDER BY o.id
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await db.query(`
      SELECT o.id, o.customerId, o.orderDate, o.status, o.dishId, d.name as dishName, d.description as dishDescription, d.price
      FROM orders o
      JOIN dishes d ON o.dishId = d.id
      WHERE o.id = $1
    `, [id]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Užsakymas nerastas' });

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { customerId, dishId } = req.body;

    // Patikrinam, ar egzistuoja klientas ir patiekalas
    const customer = await db.query('SELECT * FROM customers WHERE id = $1', [customerId]);
    if (customer.rows.length === 0) return res.status(400).json({ message: 'Klientas nerastas' });

    const dish = await db.query('SELECT * FROM dishes WHERE id = $1', [dishId]);
    if (dish.rows.length === 0) return res.status(400).json({ message: 'Patiekalas nerastas' });

    const result = await db.query(
      'INSERT INTO orders(customerId, dishId) VALUES($1, $2) RETURNING *',
      [customerId, dishId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const id = req.params.id;
    const { status } = req.body;

    const orderCheck = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderCheck.rows.length === 0) return res.status(404).json({ message: 'Uzsakymas nerastas' });

    const result = await db.query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING *', [status, id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const id = req.params.id;

    const orderCheck = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderCheck.rows.length === 0) return res.status(404).json({ message: 'Uzsakymas nerastas' });

    await db.query('DELETE FROM orders WHERE id = $1', [id]);
    res.json({ message: 'Uzsakymas istrintas' });
  } catch (err) {
    next(err);
  }
};
