const db = require('../models/db');
const { validationResult } = require('express-validator');

exports.getAllDishes = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM dishes ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.createDish = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, description, price } = req.body;
    const result = await db.query(
      'INSERT INTO dishes(name, description, price) VALUES($1, $2, $3) RETURNING *',
      [name, description || null, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateDish = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const id = req.params.id;
    const { name, description, price } = req.body;

    const dishCheck = await db.query('SELECT * FROM dishes WHERE id = $1', [id]);
    if (dishCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Patiekalas nerastas' });
    }

    const updatedDish = {
      name: name || dishCheck.rows[0].name,
      description: description === undefined ? dishCheck.rows[0].description : description,
      price: price || dishCheck.rows[0].price,
    };

    const result = await db.query(
      'UPDATE dishes SET name=$1, description=$2, price=$3 WHERE id=$4 RETURNING *',
      [updatedDish.name, updatedDish.description, updatedDish.price, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteDish = async (req, res, next) => {
  try {
    const id = req.params.id;

    const dishCheck = await db.query('SELECT * FROM dishes WHERE id = $1', [id]);
    if (dishCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Patiekalas nerastas' });
    }

    await db.query('DELETE FROM dishes WHERE id = $1', [id]);
    res.json({ message: 'Patiekalas istrintas' });
  } catch (err) {
    next(err);
  }
};
