const express = require('express');
const {
    listEmpresas,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    getEmpresaDetalhada
} = require('../controllers/empresaController');

const router = express.Router();

router.get('/', listEmpresas);

router.post('/', createEmpresa);

router.put('/:id', updateEmpresa);

router.delete('/:id', deleteEmpresa);

router.get("/vw_empresa_detalhada", getEmpresaDetalhada); 

module.exports = router;
