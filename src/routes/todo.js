const express = require('express');
const controller = require('../controller/todoController');
const router = express.Router();

router.post('/', controller.create);

router.get('/', controller.todos);

router.get('/:id', controller.getById);

router.patch('/:id', controller.update);

router.delete('/:id', controller.remove);

module.exports = router;