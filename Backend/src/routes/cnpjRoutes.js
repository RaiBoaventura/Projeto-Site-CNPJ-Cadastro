const express = require('express');
const { fetchCnpjData } = require('../controllers/cnpjController');

const router = express.Router();

router.get('/:cnpj', fetchCnpjData);

module.exports = router;
