const express = require('express');

const router = express.Router();
const friendshipController = require('../controllers/friendship_controller');


router.get('/toggle', friendshipController.toggleFriend);


module.exports = router;