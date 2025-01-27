const express = require('express');
const {
    saveBankReferences,
    saveCommercialReferences,
    listReferencesByEmpresa,
} = require('../controllers/referenciaController');

const router = express.Router();

// Rota para salvar ou atualizar referências bancárias
router.post('/bancarias', saveBankReferences);

// Rota para salvar ou atualizar referências comerciais
router.post('/comerciais', saveCommercialReferences);

// Rota para listar todas as referências de uma empresa
router.get('/:id_empresa', listReferencesByEmpresa);

module.exports = router;
