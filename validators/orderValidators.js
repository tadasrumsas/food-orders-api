const { body } = require('express-validator');

exports.createOrderValidator = [
  body('customerId').isInt().withMessage('customerId turi buti sveikasis skaicius'),
  body('dishId').isInt().withMessage('dishId turi būti sveikasis skaicius'),
];

exports.updateOrderValidator = [
  body('status').isIn(['pending', 'preparing', 'delivered', 'cancelled']).withMessage('Neteisingas statusas'),
];
