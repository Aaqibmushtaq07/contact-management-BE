const express = require('express');
const app = express();
const {
  userSignup,
  userLogin,
  currentUSer,
} = require('../controller/userController');
const authToken = require('../middleware/validateToken');
const router = express.Router();
router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/current', authToken, currentUSer);

module.exports = router;
