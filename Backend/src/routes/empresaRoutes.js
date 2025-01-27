const express = require('express');
const {
    listEmpresas,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
} = require('../controllers/empresaController');

const router = express.Router();

// Rota para listar todas as empresas
router.get('/', listEmpresas);

// Rota para criar uma nova empresa
router.post('/', createEmpresa);

// Rota para atualizar uma empresa
router.put('/:id', updateEmpresa);

// Rota para deletar uma empresa
router.delete('/:id', deleteEmpresa);

module.exports = router;
