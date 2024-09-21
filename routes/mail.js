const express = require("express");

const userController = require("../controllers/mail");
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.post('/send', authenticate, userController.send);
router.get('/inbox', authenticate, userController.inbox);

module.exports = router;