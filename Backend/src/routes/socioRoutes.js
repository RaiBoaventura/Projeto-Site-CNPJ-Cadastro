const express = require('express');
const {
    saveSocios,
    listSociosByEmpresa,
    deleteSocio,
} = require('../controllers/socioController'); 

const router = express.Router();

router.post('/', saveSocios);

router.get('/empresa/:id_empresa', listSociosByEmpresa);

router.delete('/:id', deleteSocio);

module.exports = router;
