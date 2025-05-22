const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    // Patikrinam ar jau yra registruotas admin
    const existingAdmins = await db.query('SELECT * FROM admins');
    if (existingAdmins.rows.length > 0) {
      return res.status(403).json({ message: 'Registracija jau atlikta' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO admins(username, password) VALUES($1, $2)', [username, hashedPassword]);

    res.status(201).json({ message: 'Administratorius uzregistruotas' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    const userResult = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    const user = userResult.rows[0];

    if (!user) return res.status(401).json({ message: 'Neteisingas vartotojo vardas arba slaptazodis' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Neteisingas vartotojo vardas arba slaptazodis' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    res.json({ message: 'Prisijungta sekmingai' });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Atsijungta' });
};
