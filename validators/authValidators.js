const { body } = require('express-validator');

exports.registerValidator = [
  body('username').isString().isLength({ min: 3 }).withMessage('Vartotojo vardas turi buti bent 3 simboliu'),
  body('password').isLength({ min: 6 }).withMessage('Slaptazodis turi buti bent 6 simboliu'),
];

exports.loginValidator = [
  body('username').exists().withMessage('Vartotojo vardas privalomas'),
  body('password').exists().withMessage('Slaptazodis privalomas'),
];
