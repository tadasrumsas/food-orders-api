const { body } = require('express-validator');

exports.createCustomerValidator = [
  body('name').isString().isLength({ min: 2 }).withMessage('Vardas turi buti bent 2 simboliu'),
  body('email').isEmail().withMessage('Neteisingas el. pasto formatas'),
  body('phone').optional().matches(/^\d+$/).withMessage('Telefono numeris turi būti tik skaiciai'),
];

exports.updateCustomerValidator = [
  body('name').optional().isString().isLength({ min: 2 }),
  body('email').optional().isEmail(),
  body('phone').optional().matches(/^\d+$/),
];
