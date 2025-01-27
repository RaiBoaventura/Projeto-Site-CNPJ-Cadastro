const express = require('express');
const {
    saveSocios,
    listSociosByEmpresa,
    deleteSocio,
} = require('../controllers/socioController');

const router = express.Router();

// Rota para salvar ou atualizar sócios
router.post('/', saveSocios);

// Rota para listar sócios por ID da empresa
router.get('/:id_empresa', listSociosByEmpresa);

// Rota para deletar um sócio
router.delete('/', deleteSocio);

module.exports = router;
