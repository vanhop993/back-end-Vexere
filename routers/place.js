const express = require('express');
const { postNewPlace } = require('../controllers/place');
const auth = require('../helpers/authorization');
const router = express.Router();

router.post('/place',auth(["admin"]),postNewPlace);

module.exports = router