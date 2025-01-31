const express = require('express');
const {
    saveSocios,
    listSociosByEmpresa,
    deleteSocio,
} = require('../controllers/socioController'); // Verifique se esse caminho está correto

const router = express.Router();

// 🔹 Rota para salvar ou atualizar sócios
router.post('/', saveSocios);

// 🔹 Rota para listar sócios por ID da empresa
router.get('/empresa/:id_empresa', listSociosByEmpresa);

// 🔹 Rota para deletar um sócio (agora espera um ID)
router.delete('/:id', deleteSocio);

module.exports = router;
