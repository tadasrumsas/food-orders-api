const { body } = require('express-validator');

exports.createDishValidator = [
  body('name').isString().isLength({ min: 2 }).withMessage('Pavadinimas turi buti bent 2 simboliu'),
  body('price').isFloat({ gt: 0 }).withMessage('Kaina turi būti teigiamas skaicius'),
];

exports.updateDishValidator = [
  body('name').optional().isString().isLength({ min: 2 }).withMessage('Pavadinimas turi buti bent 2 simboliu'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Kaina turi buti teigiamas skaicius'),
];
