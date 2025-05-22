const db = require('../models/db');
const { validationResult } = require('express-validator');

exports.getAllCustomers = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM customers ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, phone } = req.body;

    // Patikrinam unikalumą email
    const emailCheck = await db.query('SELECT * FROM customers WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Toks el. pastas jau naudojamas' });
    }

    const result = await db.query(
      'INSERT INTO customers(name, email, phone) VALUES($1, $2, $3) RETURNING *',
      [name, email, phone || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const id = req.params.id;
    const { name, email, phone } = req.body;

    const customerCheck = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Klientas nerastas' });
    }

    // Jeigu keičiam el. paštą, patikrinam unikalumą
    if (email && email !== customerCheck.rows[0].email) {
      const emailExists = await db.query('SELECT * FROM customers WHERE email = $1', [email]);
      if (emailExists.rows.length > 0) {
        return res.status(400).json({ message: 'Toks el. pastas jau naudojamas' });
      }
    }

    const updatedCustomer = {
      name: name || customerCheck.rows[0].name,
      email: email || customerCheck.rows[0].email,
      phone: phone === undefined ? customerCheck.rows[0].phone : phone,
    };

    const result = await db.query(
      'UPDATE customers SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING *',
      [updatedCustomer.name, updatedCustomer.email, updatedCustomer.phone, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const id = req.params.id;

    const customerCheck = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Klientas nerastas' });
    }

    await db.query('DELETE FROM customers WHERE id = $1', [id]);
    res.json({ message: 'Klientas istrintas' });
  } catch (err) {
    next(err);
  }
};
