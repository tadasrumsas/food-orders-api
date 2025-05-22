const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/authMiddleware');
const { createOrderValidator, updateOrderValidator } = require('../validators/orderValidators');

router.get('/', authenticate, orderController.getAllOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.post('/', authenticate, createOrderValidator, orderController.createOrder);
router.put('/:id', authenticate, updateOrderValidator, orderController.updateOrderStatus);
router.patch('/:id', authenticate, updateOrderValidator, orderController.updateOrderStatus);
router.delete('/:id', authenticate, orderController.deleteOrder);

module.exports = router;
