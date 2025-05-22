const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');
const { authenticate } = require('../middlewares/authMiddleware');
const { createDishValidator, updateDishValidator } = require('../validators/dishValidators');

router.get('/', authenticate, dishController.getAllDishes);
router.post('/', authenticate, createDishValidator, dishController.createDish);
router.put('/:id', authenticate, updateDishValidator, dishController.updateDish);
router.patch('/:id', authenticate, updateDishValidator, dishController.updateDish);
router.delete('/:id', authenticate, dishController.deleteDish);

module.exports = router;
