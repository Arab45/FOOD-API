const express = require('express');
const router = express.Router();
const { makeOrder, fetchAllOrder, fetchSingleOrder } = require('../controller/user-general-controllers');
const { verifyUserLoginToken } = require('../controller/user-auth-controller');


router.post('/user-orders', verifyUserLoginToken, makeOrder);
router.get('/all-orders', fetchAllOrder);
router.get('/single-order/:id', fetchSingleOrder);

module.exports = router;