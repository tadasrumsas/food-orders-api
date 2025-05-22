const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticate } = require('../middlewares/authMiddleware');
const { createCustomerValidator, updateCustomerValidator } = require('../validators/customerValidators');

router.get('/', authenticate, customerController.getAllCustomers);
router.post('/', authenticate, createCustomerValidator, customerController.createCustomer);
router.put('/:id', authenticate, updateCustomerValidator, customerController.updateCustomer);
router.patch('/:id', authenticate, updateCustomerValidator, customerController.updateCustomer);
router.delete('/:id', authenticate, customerController.deleteCustomer);

module.exports = router;
