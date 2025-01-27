const express = require('express');
const { fetchCnpjData } = require('../controllers/cnpjController');

const router = express.Router();

// Rota para buscar dados de um CNPJ
router.get('/:cnpj', fetchCnpjData);

module.exports = router;
