const express = require("express");

const userController = require("../controllers/mail");
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.post('/send', authenticate, userController.send);
router.get('/inbox', authenticate, userController.inbox);
router.get('/inbox/:id', authenticate, userController.mailDetails);
router.put('/mark-as-read/:id', authenticate, userController.markAsRead);

module.exports = router;