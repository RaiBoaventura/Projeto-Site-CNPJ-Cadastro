const express = require('express');
const {
    saveBankReferences,
    saveCommercialReferences,
    listReferencesByEmpresa,
} = require('../controllers/referenciaController');

const router = express.Router();

router.post('/bancarias', saveBankReferences);

router.post('/comerciais', saveCommercialReferences);

router.get('/:id_empresa', listReferencesByEmpresa);

module.exports = router;
